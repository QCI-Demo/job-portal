# Job Portal

Automated CI/CD and AWS infrastructure for the Job Portal platform.

## CI/CD

See [`docs/ci-cd-pipeline.md`](docs/ci-cd-pipeline.md) for the GitHub Actions
pipeline (lint, test, Docker/ECR, Trivy security scan, Terraform staging,
production approval).

Security scanning details: [`docs/security-scanning.md`](docs/security-scanning.md).

## Infrastructure

See [`terraform/README.md`](terraform/README.md) for remote state and modules.
