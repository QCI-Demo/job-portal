# Job Portal

Cloud-native job portal with automated CI/CD and AWS infrastructure provisioned
via Terraform.

## Terraform

Reusable modules and remote state bootstrap live under [`terraform/`](terraform/README.md):

- **Remote state** — S3 bucket (encrypted, versioned) + DynamoDB locking
- **IAM** — CI/CD (GitHub OIDC), ECS task execution, RDS access
- **VPC** — public/private subnets across two AZs, NAT, route tables
- **RDS** — PostgreSQL with Secrets Manager and IAM auth
- **ECS** — Fargate cluster, execution role, ALB-facing security group

```bash
./terraform/scripts/validate.sh
```

See [`docs/terraform-remote-state-and-modules.md`](docs/terraform-remote-state-and-modules.md)
for the story deliverable summary.
