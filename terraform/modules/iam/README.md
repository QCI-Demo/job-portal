# IAM Roles Module

Reusable IAM roles and least-privilege policies for the Job Portal CI/CD pipeline,
ECS/EKS workloads, and RDS access.

## Features

- CI/CD role assumable via GitHub Actions OIDC
- Permissions for S3 remote state, DynamoDB locking, ECR, and Terraform apply
- ECS task execution role with `AmazonECSTaskExecutionRolePolicy`
- Optional EKS cluster and node roles (`create_eks_roles = true`)
- RDS read/write + IAM DB connect policy

## Usage

```hcl
module "iam" {
  source = "../../modules/iam"

  name_prefix         = "job-portal-dev"
  github_repository   = "QCI-Demo/job-portal"
  create_oidc_provider = true
  state_bucket_arn    = module.remote_state.state_bucket_arn
  state_lock_table_arn = module.remote_state.lock_table_arn

  tags = {
    Project     = "job-portal"
    Environment = "dev"
  }
}
```

## Outputs

| Name | Description |
|------|-------------|
| `cicd_role_arn` | CI/CD role ARN |
| `ecs_task_execution_role_arn` | ECS execution role ARN |
| `rds_access_role_arn` | RDS access role ARN |
