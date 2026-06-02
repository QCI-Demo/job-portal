# Secrets management for CI/CD

This document describes how the Job Portal stores, references, and audits secrets in GitHub Actions. **Never commit real credentials** to the repository. Use [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and [Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) instead.

## Principles

1. **Secrets live only in GitHub** (repository or environment scope), or in your cloud provider’s secret store—not in source control.
2. **Workflows reference secrets by name** via `${{ secrets.NAME }}` or environment-scoped secrets. Do not echo, `printenv`, or log secret values.
3. **Disposable CI defaults** (`jobportal` in `.env.docker.example`) are for local development and ephemeral CI service containers only. Staging and production must use unique, rotated credentials stored as secrets.
4. **Every sensitive workflow job** ends with a log audit step; completed runs are also scanned by the `Secret log audit` workflow.

## Where to configure secrets

| Scope | Use for |
| ----- | ------- |
| **Repository secrets** | CI database overrides, shared registry tokens used in PR builds |
| **Environment: `staging`** | Staging deploy host, DB URL, registry, frontend API URL |
| **Environment: `production`** | Production deploy host, DB URL, registry (stricter protection rules recommended) |

Configure under **Settings → Secrets and variables → Actions** (repository) or **Settings → Environments → staging / production** (environment).

See **[.github/REQUIRED_SECRETS.md](../.github/REQUIRED_SECRETS.md)** for the full secret inventory.

## Referencing secrets in workflows

### Repository / CI secrets

```yaml
env:
  POSTGRES_PASSWORD: ${{ secrets.CI_POSTGRES_PASSWORD }}
steps:
  - name: Materialize compose .env from GitHub Secrets
    env:
      POSTGRES_PASSWORD: ${{ secrets.CI_POSTGRES_PASSWORD }}
    run: ./scripts/materialize-compose-env.sh
```

`scripts/materialize-compose-env.sh` writes `.env` from environment variables and registers values with `::add-mask::` without printing them.

### Environment-scoped deploy secrets

The **[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)** job sets `environment: staging` or `production` and reads secrets such as `DATABASE_URL`, `DOCKER_REGISTRY_TOKEN`, and `DEPLOY_SSH_KEY` from that environment.

```yaml
jobs:
  deploy:
    environment: staging
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Required secrets are validated before deploy; missing names fail the job without exposing values.

### Composite action: database env

**[`.github/actions/setup-ci-database-env`](../.github/actions/setup-ci-database-env/action.yml)** centralizes PostgreSQL client env vars and masks passwords:

```yaml
- uses: ./.github/actions/setup-ci-database-env
  with:
    postgres_password: ${{ secrets.CI_POSTGRES_PASSWORD }}
```

## Preventing exposure in logs

| Mechanism | Location |
| --------- | -------- |
| GitHub automatic masking | Any value from `secrets.*` in workflow expressions |
| `::add-mask::` | Deploy job and `materialize-compose-env.sh` for dynamic values |
| Captured log audit per job | `audit-step-logs` composite action + `scripts/audit-workflow-logs.sh` |
| Post-run workflow audit | `.github/workflows/secret-log-audit.yml` downloads completed run logs and scans them |

### Patterns flagged by the audit script

- GitHub personal access tokens (`ghp_`, `github_pat_`)
- Private key blocks
- Connection URLs with embedded credentials (`postgresql://user:pass@…`)
- Obvious `password=` / `api_key=` assignments with non-masked values

Run locally after reproducing a failing job:

```bash
gh run download <run-id> --dir /tmp/run-logs
./scripts/audit-workflow-logs.sh --log-file /tmp/run-logs/<job>/<step>.txt
```

## Procedures

### Adding a new secret

1. Add the name and description to **[`.github/REQUIRED_SECRETS.md`](../.github/REQUIRED_SECRETS.md)**.
2. Create the secret in GitHub (repository or environment scope).
3. Reference it only via `${{ secrets.NAME }}` or `env:` blocks—never in committed files.
4. If the value might appear in command output, call `echo "::add-mask::VALUE"` in a step (without logging the value elsewhere).
5. Open a PR and confirm CI + secret log audit workflows pass.

### Rotating a compromised secret

1. Revoke or rotate the credential in the upstream system (database, registry, cloud IAM).
2. Update the GitHub secret value.
3. Re-run deploy or affected CI workflows.
4. Review the workflow run that may have leaked the secret; use `secret-log-audit` artifacts if enabled.

### Forked pull requests

Secrets are **not** available to workflows triggered from forks. CI jobs fall back to disposable `jobportal` credentials for ephemeral Postgres service containers. Deploy workflows should not run from untrusted forks.

## Related documentation

- [`.github/REQUIRED_SECRETS.md`](../.github/REQUIRED_SECRETS.md) — secret names and scopes
- [`docs/docker-compose.md`](docker-compose.md) — local `.env` files (gitignored)
- [`.env.docker.example`](../.env.docker.example) — non-secret defaults for local compose
