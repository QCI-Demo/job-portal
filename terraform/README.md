# Terraform Infrastructure — Job Portal

Secure remote state and reusable core modules for provisioning AWS environments
(dev, staging, prod).

## Layout

```
terraform/
├── backend/                 # S3 + DynamoDB remote state bootstrap
├── modules/
│   ├── iam/                 # CI/CD, ECS execution, RDS access roles
│   ├── vpc/                 # VPC, subnets, NAT, route tables
│   ├── rds/                 # PostgreSQL with Secrets Manager + IAM auth
│   ├── ecs/                 # ECS cluster, execution role, SG
│   └── monitoring/          # CloudWatch dashboards, Budgets, SNS alerts
└── environments/
    ├── dev/                 # Example environment composition
    ├── staging/             # Staging (CI/CD auto-apply) + account budget
    └── production/          # Production (manual approval gate)
```

## Bootstrap order

1. Apply IAM module (or create CI/CD role) so a role ARN exists.
2. Apply `backend/` in a dedicated Terraform workspace to create the state bucket and lock table.
3. Configure S3 backend on environment roots and apply VPC → ECS → RDS.

```bash
# Validate all modules
./terraform/scripts/validate.sh

# Bootstrap remote state (requires AWS credentials)
cd terraform/backend
cp bootstrap.tfvars.example bootstrap.tfvars   # edit placeholders
terraform init
terraform workspace new bootstrap || terraform workspace select bootstrap
terraform apply -var-file=bootstrap.tfvars
```

## Modules

| Module | Purpose |
|--------|---------|
| [iam](modules/iam) | CI/CD OIDC role, ECS execution, RDS access |
| [vpc](modules/vpc) | Multi-AZ VPC with public/private subnets + NAT |
| [rds](modules/rds) | Encrypted PostgreSQL with IAM auth |
| [ecs](modules/ecs) | Fargate cluster + ALB-facing security group |
| [monitoring](modules/monitoring) | CloudWatch ops dashboard, $150 budget, SNS email alerts |
| [backend](backend) | S3 state + DynamoDB locking |

## Environments

| Environment | Path | Notes |
|-------------|------|-------|
| dev | `environments/dev` | Local / sandbox |
| staging | `environments/staging` | Auto-applied by CI after Docker push; owns account AWS Budget |
| production | `environments/production` | Applied only after `prod-approval` gate |

CI selects Terraform workspaces `staging` / `production` before apply. See
[`docs/ci-cd-pipeline.md`](../docs/ci-cd-pipeline.md) and the ops run-book
[`docs/pipeline/README.md`](../docs/pipeline/README.md).
