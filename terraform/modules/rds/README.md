# RDS PostgreSQL Module

Provisions an Amazon RDS PostgreSQL instance with subnet groups, parameter
groups, encryption at rest, automated backups, and IAM database authentication.

## Features

- `aws_db_subnet_group` across private subnets
- `aws_db_parameter_group` with SSL forced
- `aws_db_instance` (RDS) with encryption and backup retention
- Master password managed via AWS Secrets Manager
- IAM database authentication enabled

## Usage

```hcl
module "rds" {
  source = "../../modules/rds"

  name_prefix               = "job-portal-dev"
  vpc_id                    = module.vpc.vpc_id
  subnet_ids                = module.vpc.private_subnet_ids
  allowed_security_group_ids = [module.ecs.security_group_id]
  instance_class            = "db.t3.micro"
  engine_version            = "15.4"
  db_name                   = "jobportal"
  username                  = "jobportal_admin"
  manage_master_user_password = true
  backup_retention_period   = 7

  tags = {
    Project     = "job-portal"
    Environment = "dev"
  }
}
```

## Outputs

| Name | Description |
|------|-------------|
| `endpoint` | Database hostname |
| `port` | Database port (5432) |
| `db_instance_arn` | Instance ARN |
| `security_group_id` | RDS security group ID |
