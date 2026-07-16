# Monitoring Module — CloudWatch Dashboards, Budgets & SNS Alerts

Provisions:

- `aws_sns_topic` + email subscription for the ops lead
- `aws_budgets_budget` with a $150 monthly limit and FORECASTED/ACTUAL SNS notifications
- `aws_cloudwatch_dashboard.job_portal` with ECS CPU/memory, RDS CPU/memory/connections, and total estimated cost widgets

## Usage

```hcl
module "monitoring" {
  source = "../../modules/monitoring"

  name_prefix      = var.name_prefix
  environment      = var.environment
  alert_email      = var.budget_alert_email
  budget_limit_amount = "150"
  create_budget    = true   # enable in one environment only (account-level)
  ecs_cluster_name = module.ecs.cluster_name
  rds_instance_id  = module.rds.db_instance_id
  aws_region       = var.aws_region
  tags             = var.tags
}
```

### Targeted apply

```bash
cd terraform/environments/staging
terraform init
terraform apply -target=module.monitoring.aws_cloudwatch_dashboard.job_portal
terraform apply -target=module.monitoring
```

### Confirm subscription

AWS emails a confirmation link to `alert_email`. Confirm it before budget
notifications are delivered.

### Test budget alert

Temporarily lower the limit (or raise `budget_threshold_percent` sensitivity)
and wait for the FORECASTED notification, or use the AWS Budgets console to
simulate/adjust forecast assumptions:

```bash
terraform apply -var='budget_limit_amount=1'
# restore after confirming SNS delivery
terraform apply -var='budget_limit_amount=150'
```

## Inputs

| Name | Description | Default |
|------|-------------|---------|
| `name_prefix` | Resource name prefix | — |
| `environment` | Environment label | — |
| `alert_email` | SNS email endpoint | — |
| `budget_limit_amount` | Monthly USD limit | `"150"` |
| `create_budget` | Create account budget | `true` |
| `ecs_cluster_name` | ECS cluster for widgets | — |
| `rds_instance_id` | RDS identifier for widgets | — |
| `widgets` | Override full dashboard body | `null` (built-in defaults) |
