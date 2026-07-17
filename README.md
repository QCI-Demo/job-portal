# Job Portal

Cloud-native job portal with automated CI/CD and AWS infrastructure provisioned
via Terraform.

## CI/CD

GitHub Actions workflow: [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)

| Trigger | Pipeline |
|---------|----------|
| `pull_request` (`main`, `develop`) | checkout → lint → test |
| `push` (`main`, `develop`) | + Docker build/push to ECR → Trivy security scan → Terraform apply (staging) |
| `workflow_dispatch` | + `prod-approval` gate → Terraform apply (production) |

Details and required secrets/variables: [`docs/ci-cd-pipeline.md`](docs/ci-cd-pipeline.md).
Security scanning (Trivy, CRITICAL fail-fast, Slack alerts): [`docs/security-scanning.md`](docs/security-scanning.md).
Ops run-book (approvals, rollback, CloudWatch dashboards): [`docs/pipeline/README.md`](docs/pipeline/README.md).
Monitoring (dashboards, $150 budget, SNS): [`docs/cloudwatch-budgets-monitoring.md`](docs/cloudwatch-budgets-monitoring.md).

```bash
# Frontend lint
cd frontend && npm ci && npm run lint

# Backend tests
cd backend && pip install -r requirements.txt && pytest -q
```

## Terraform

Reusable modules and remote state bootstrap live under [`terraform/`](terraform/README.md):

- **Remote state** — S3 bucket (encrypted, versioned) + DynamoDB locking
- **IAM** — CI/CD (GitHub OIDC), ECS task execution, RDS access
- **VPC** — public/private subnets across two AZs, NAT, route tables
- **RDS** — PostgreSQL with Secrets Manager and IAM auth
- **ECS** — Fargate cluster, execution role, ALB-facing security group
- **Monitoring** — CloudWatch ops dashboard, AWS Budget ($150), SNS email alerts

```bash
./terraform/scripts/validate.sh
```

See [`docs/terraform-remote-state-and-modules.md`](docs/terraform-remote-state-and-modules.md)
for the story deliverable summary.
