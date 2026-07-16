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
│   └── ecs/                 # ECS cluster, execution role, SG
└── environments/
    └── dev/                 # Example environment composition
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
| [backend](backend) | S3 state + DynamoDB locking |

## Environments

Copy `environments/dev` for `staging` and `prod`, adjusting CIDRs, instance
sizes, Multi-AZ, and deletion protection.
