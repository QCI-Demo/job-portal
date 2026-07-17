# Story Execution: Set Up CloudWatch Dashboards, Cost Alerts, and Documentation

**Story ID:** `11bfe7f9-3d4f-4152-b3f4-ac06d659f3c0`

## Summary

Adds CloudWatch operations dashboards (ECS CPU/memory, RDS performance, estimated
cost), an AWS Budget at **$150**/month with SNS email alerts on forecasted/actual
overruns, and an ops run-book covering pipeline stages, approvals, rollback, and
dashboard usage.

## Deliverables

| Task | ID | Deliverable |
|------|-----|-------------|
| AWS Budget + SNS | `c044b594-083c-4b8a-9426-67e710a270e9` | `aws_sns_topic`, email subscription, `aws_budgets_budget` (`limit_amount = "150"`) in `terraform/modules/monitoring` |
| CloudWatch dashboard | `33245004-1963-4417-b6b4-5cc2091b155e` | `aws_cloudwatch_dashboard.job_portal` with ECS CPU, RDS CPU, and total cost widgets |
| Pipeline run-book | `200c42de-6d7a-42fc-be0c-561898eb0751` | [`docs/pipeline/README.md`](./pipeline/README.md) |

## Apply notes

AWS credentials are required for live apply. From staging (owns the account budget):

```bash
cd terraform/environments/staging
terraform init
terraform apply -target=module.monitoring
# or dashboard only:
terraform apply -target=module.monitoring.aws_cloudwatch_dashboard.job_portal
```

Confirm the SNS subscription email before alerts are delivered. To test the budget
notification, temporarily set `-var='budget_limit_amount=1'`, verify the email, then
restore `150`.

See the run-book for rollback (`terraform destroy`, previous image tag revert) and
dashboard interpretation.
