# Story Execution: Provision Terraform Remote State and Core Infrastructure Modules

**Story ID:** ee347f8f-2132-4b2c-903f-c662e2c75998

## Summary

Establishes a secure Terraform remote state backend (S3 + DynamoDB locking) and
reusable AWS infrastructure modules (VPC, RDS PostgreSQL, ECS, IAM) so Job Portal
environments (dev, staging, prod) can be provisioned repeatably.

## Tasks completed

| Task | ID | Deliverable |
|------|-----|-------------|
| IAM Roles Module | 6332ef15-8746-4f50-9848-45f32d712ea7 | `terraform/modules/iam` |
| RDS PostgreSQL Module | b1f34854-9a46-4e0a-bdc4-a0d46f619e54 | `terraform/modules/rds` |
| VPC Module | 58cd9391-60de-4cae-84ed-5449dfc07718 | `terraform/modules/vpc` |
| ECS Cluster Module | 6716f684-a6f5-4d25-b91e-8b5f603bf80b | `terraform/modules/ecs` |
| Remote State (S3 + DynamoDB) | 4ae23598-b5ca-40f0-8df0-37c2f2f4246b | `terraform/backend` |

## Validation

```bash
./terraform/scripts/validate.sh
```

Runs `terraform fmt -check` and `terraform validate` for every module and
environment root. See `artifacts/terraform-validation-report.md`.

## Apply notes

Remote state bootstrap requires AWS credentials:

```bash
cd terraform/backend
cp bootstrap.tfvars.example bootstrap.tfvars
# set bucket_name and cicd_role_arn (no secrets in git)
../scripts/bootstrap-remote-state.sh
```

The bootstrap script creates/selects the `bootstrap` workspace, plans, and applies
the S3 state bucket (private ACL, versioning, SSE) and DynamoDB lock table
(`LockID`, `PAY_PER_REQUEST`), then attaches the CI/CD state-access IAM policy.
