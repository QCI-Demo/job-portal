# Required GitHub Actions secrets

Configure these in **Settings → Secrets and variables → Actions**. Deploy-related entries should be created per **Environment** (`staging`, `production`) unless noted.

| Secret | Scope | Required | Used by |
| ------ | ----- | -------- | ------- |
| `CI_POSTGRES_USER` | Repository | No | CI compose jobs (defaults to `jobportal`) |
| `CI_POSTGRES_PASSWORD` | Repository | No | CI, schema/seed validation (defaults to `jobportal`) |
| `CI_POSTGRES_DB` | Repository | No | CI compose jobs (defaults to `jobportal`) |
| `DOCKER_REGISTRY` | Environment | Yes (deploy) | `deploy.yml` — registry hostname |
| `DOCKER_REGISTRY_USERNAME` | Environment | Yes (deploy) | `deploy.yml` — `docker login` |
| `DOCKER_REGISTRY_TOKEN` | Environment | Yes (deploy) | `deploy.yml` — registry password / token |
| `DATABASE_URL` | Environment | Yes (deploy) | Application and migration deploy |
| `DEPLOY_HOST` | Environment | Yes (deploy) | SSH target hostname |
| `DEPLOY_USER` | Environment | Yes (deploy) | SSH user |
| `DEPLOY_SSH_KEY` | Environment | Yes (deploy) | Private key for deploy (multiline PEM) |
| `VITE_API_BASE_URL` | Environment | No | Frontend runtime URL in cloud |
| `CORS_ORIGIN` | Environment | No | Backend CORS allowlist |

## Setup checklist

- [ ] Create GitHub environments `staging` and `production` with required reviewers for production.
- [ ] Add repository secrets for CI overrides (optional).
- [ ] Add environment secrets for each deploy target.
- [ ] Confirm **Actions → General → Fork pull request workflows** policy matches your security model.
- [ ] Run **CI** on a branch and verify **Secret log audit** completes after the run.

Full procedures: **[docs/secrets-management.md](../docs/secrets-management.md)**.
