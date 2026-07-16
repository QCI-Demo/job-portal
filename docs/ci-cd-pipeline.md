# Story Execution: Configure GitHub Actions CI/CD Pipeline

**Story ID:** ba9024dd-32d2-4ae0-8501-cb9baffc3da0

## Summary

Implements a GitHub Actions CI/CD pipeline for Job Portal that lints the
frontend, runs backend unit tests, builds and pushes a Docker image to Amazon
ECR, applies Terraform to staging, and gates production deploys behind a
manual GitHub Environment approval (`prod-approval`).

## Workflow

File: [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml)

| Trigger | Jobs |
|---------|------|
| `pull_request` (main, develop) | checkout → lint, test |
| `push` (main, develop) | checkout → lint, test → build → security-scan → terraform-apply-staging |
| `workflow_dispatch` | full pipeline + approval → terraform-apply-prod |

### Job graph

```
checkout
   ├── lint (ESLint / frontend)
   └── test (pytest / backend)
            └── build (Docker → ECR)          [push | workflow_dispatch]
                     └── security-scan (Trivy)  [fail-fast on CRITICAL]
                              └── terraform-apply-staging
                                       └── approval (environment: prod-approval)
                                                └── terraform-apply-prod
```

See also: [security-scanning.md](./security-scanning.md) for Trivy, artifact retention, and Slack notifications.
## Tasks completed

| Task | ID | Deliverable |
|------|-----|-------------|
| Workflow skeleton | a5f08686-77a1-4825-be02-892921468090 | `.github/workflows/ci-cd.yml` with push/PR triggers and jobs |
| Lint & test | dbed988f-7824-4801-9f94-58a694f68789 | `actions/setup-node` + `npm run lint`; `actions/setup-python` + `pytest` |
| Docker / ECR | 337950ae-0df7-4164-86fb-25e1d69e7de2 | AWS credentials, `aws ecr get-login-password`, build/push `${ECR_REPO}:${{ github.sha }}` |
| Terraform staging | 5b7a7da6-e760-4a57-9143-0f4970983e02 | `hashicorp/setup-terraform`, workspace `staging`, plan + apply |
| Prod approval | 415c963b-9c22-4d49-8314-c4ce1d0287ca | `prod-approval` environment gate + `terraform-apply-prod` on `workflow_dispatch` |

## Required GitHub configuration

### 1. Create the `prod-approval` environment

Environments cannot be fully provisioned from the workflow file alone.
Create and protect the environment in the GitHub UI:

1. Open **Settings → Environments → New environment**.
2. Name it exactly `prod-approval`.
3. Enable **Required reviewers** and add at least one team member.
4. (Optional) Restrict deployment branches to `main`.

The `approval` and `terraform-apply-prod` jobs both reference
`environment: prod-approval`, so the workflow pauses until a reviewer approves.

### 2. Repository secrets and variables

| Name | Type | Purpose |
|------|------|---------|
| `AWS_ROLE_ARN` | Secret | IAM role assumed via OIDC (`aws-actions/configure-aws-credentials`) |
| `SLACK_WEBHOOK_URL` | Secret | Incoming webhook for security-scan failure alerts |
| `AWS_DEFAULT_REGION` | Variable | AWS region (default `us-east-1`) |
| `ECR_REPO` | Variable | ECR repository name or full URI (default `job-portal-backend`) |

OIDC trust is provisioned by `terraform/modules/iam` for
`repo:QCI-Demo/job-portal:*`.

## Local verification

```bash
# Frontend lint
cd frontend && npm ci && npm run lint

# Backend tests
cd backend && pip install -r requirements.txt && pytest -q

# Docker image
cd backend && docker build -t job-portal-backend:local .
```

## Supporting app scaffolding

Minimal `frontend/` and `backend/` packages are included so lint/test/build
jobs have runnable targets until full application code is merged.
