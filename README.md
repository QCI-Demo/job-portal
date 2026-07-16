# Job Portal

Automated CI/CD and AWS infrastructure for the Job Portal platform.

## CI/CD

See [`docs/ci-cd-pipeline.md`](docs/ci-cd-pipeline.md) for the GitHub Actions
pipeline (lint, test, Docker/ECR, Trivy security scan, Terraform staging,
production approval).

Ops run-book (approvals, rollback, CloudWatch dashboards):
[`docs/pipeline/README.md`](docs/pipeline/README.md).

Monitoring story notes: [`docs/cloudwatch-budgets-monitoring.md`](docs/cloudwatch-budgets-monitoring.md).

Security scanning details: [`docs/security-scanning.md`](docs/security-scanning.md).

## Infrastructure

See [`terraform/README.md`](terraform/README.md) for remote state and modules.
Monitoring (dashboards, $150 budget, SNS): `terraform/modules/monitoring`.
