# Job Portal — Pipeline Run-Book & Dashboard Guide

Operations guide for the CI/CD pipeline, production approvals, rollbacks, and
CloudWatch / budget monitoring.

**Story ID:** `11bfe7f9-3d4f-4152-b3f4-ac06d659f3c0`

Related docs:

- [CI/CD pipeline overview](../ci-cd-pipeline.md)
- [Security scanning](../security-scanning.md)
- [Terraform remote state & modules](../terraform-remote-state-and-modules.md)

---

## Overview

The Job Portal delivery pipeline builds, tests, scans, and deploys Dockerised
services to AWS (ECS + RDS) with Terraform. Staging deploys automatically on
push to `main` / `develop`. Production deploys only after a manual GitHub
Environment approval (`prod-approval`).

Cost guardrails:

| Control | Detail |
|---------|--------|
| AWS Budget | `$150` monthly COST budget (`limit_amount = "150"`) |
| SNS | Email to the ops lead when **FORECASTED** or **ACTUAL** spend exceeds 100% of the limit |
| CloudWatch | Per-environment dashboard: ECS CPU/memory, RDS CPU/memory/connections, estimated charges |

Terraform module: [`terraform/modules/monitoring`](../../terraform/modules/monitoring).

---

## Workflow Diagram

```
pull_request (main|develop)
  └─ checkout → lint (frontend) + test (backend)

push (main|develop)  |  workflow_dispatch
  └─ checkout
       ├─ lint (ESLint)
       └─ test (pytest)
            └─ build (Docker → ECR :${{ github.sha }})
                 └─ security-scan (Trivy; fail on CRITICAL → Slack)
                      └─ terraform-apply-staging
                           └─ [workflow_dispatch only]
                                approval (environment: prod-approval)
                                     └─ terraform-apply-prod
```

Workflow file: [`.github/workflows/ci-cd.yml`](../../.github/workflows/ci-cd.yml)

| Stage | What it does | Failure action |
|-------|----------------|----------------|
| checkout | Confirms repo layout | Fix missing paths |
| lint | Frontend ESLint | Fix lint errors; re-run |
| test | Backend pytest | Fix tests; re-run |
| build | Build/push image to ECR | Check AWS OIDC / ECR permissions |
| security-scan | Trivy HIGH/CRITICAL | Patch image; Slack alert on failure |
| terraform-apply-staging | Plan + apply staging | Inspect plan; fix Terraform |
| approval | Manual prod gate | Required reviewer approves/rejects |
| terraform-apply-prod | Plan + apply production | Same as staging; prefer rollback below |

---

## Approval Process

1. Trigger a production-capable run with **Actions → CI/CD Pipeline → Run workflow**
   (`workflow_dispatch`). Keep `deploy_production` enabled.
2. Wait until staging apply succeeds.
3. The `approval` job pauses on the GitHub Environment **`prod-approval`**.
4. A required reviewer opens the workflow run and **Approves** (or Rejects).
5. On approval, `terraform-apply-prod` runs against
   `terraform/environments/production`.

### One-time GitHub setup

1. **Settings → Environments → New environment** named exactly `prod-approval`.
2. Enable **Required reviewers**.
3. (Optional) Limit deployment branches to `main`.
4. Configure secrets/variables: `AWS_ROLE_ARN`, `SLACK_WEBHOOK_URL`,
   `AWS_DEFAULT_REGION`, `ECR_REPO`.

---

## Rollback Procedure

### A. Revert application to a previous image tag (preferred)

ECS tasks (or the Terraform image input used by the service) should run the last
known-good commit SHA tag in ECR.

```bash
# Identify previous successful SHA from GitHub Actions or ECR
PREV_SHA="<previous-github-sha>"
ECR_URI="<account>.dkr.ecr.us-east-1.amazonaws.com/job-portal-backend"

# Confirm the image still exists
aws ecr describe-images \
  --repository-name job-portal-backend \
  --image-ids imageTag="${PREV_SHA}"

# Re-apply Terraform with the previous tag (staging example)
cd terraform/environments/staging
terraform init
terraform workspace select staging
TF_VAR_image_tag="${PREV_SHA}" terraform apply -auto-approve

# Or force a new ECS deployment onto the previous tag if the service
# already references an image URI variable / task definition:
aws ecs update-service \
  --cluster job-portal-staging-cluster \
  --service job-portal-staging-api \
  --force-new-deployment
```

Production: same steps under `terraform/environments/production` after
re-approval if your process requires it, or an emergency break-glass apply with
change management recorded.

### B. Terraform destroy (environment tear-down)

Use only when intentionally removing an environment (never for a bad app
deploy — prefer image revert).

```bash
# Staging tear-down
cd terraform/environments/staging
terraform init
terraform workspace select staging
terraform plan -destroy -out=destroy.tfplan
terraform apply destroy.tfplan

# Production tear-down (requires explicit approval / change ticket)
cd terraform/environments/production
terraform init
terraform workspace select production
terraform plan -destroy -out=destroy.tfplan
# Review plan carefully — RDS may have deletion_protection = true
terraform apply destroy.tfplan
```

### C. Targeted monitoring rollback

```bash
cd terraform/environments/staging
terraform destroy -target=module.monitoring
# or re-apply a known-good commit that removes/changes monitoring resources
```

---

## Dashboard Walk-through

### Where to open

AWS Console → **CloudWatch → Dashboards** →
`job-portal-<env>-ops` (for example `job-portal-staging-ops`).

Terraform resource: `module.monitoring.aws_cloudwatch_dashboard.job_portal`.

Targeted apply:

```bash
cd terraform/environments/staging
terraform init
terraform apply -target=module.monitoring.aws_cloudwatch_dashboard.job_portal
```

### Widgets

| Widget | What healthy looks like | Investigate when |
|--------|-------------------------|------------------|
| **ECS CPU Utilization** | Stable, well below 80% | Sustained >80% → scale tasks / profile app |
| **ECS Memory Utilization** | Stable, headroom above 20% free | OOM risk / memory leaks |
| **RDS CPU Utilization** | Typically <70% | Query storms, missing indexes |
| **RDS Freeable Memory** | Not trending to zero | Increase instance class / reduce work_mem pressure |
| **RDS Database Connections** | Below `max_connections` | Connection leaks, need pooling |
| **Total Estimated Charges (USD)** | Below $150/month trajectory | Cross-check AWS Budgets + Cost Explorer |

Billing metrics are published in **`us-east-1`** only; the cost widget is pinned
to that region by design.

### Budget & SNS alerts

| Resource | Purpose |
|----------|---------|
| `aws_sns_topic.budget_alerts` | Notification channel |
| `aws_sns_topic_subscription.budget_email` | Lead email subscription (confirm the AWS email!) |
| `aws_budgets_budget.monthly` | `limit_amount = "150"` USD, FORECASTED + ACTUAL at 100% |

Account budget is created from **staging** (`create_budget = true`). Other
environments attach dashboards/SNS without duplicating the budget.

#### Confirm email subscription

After first apply, the lead must click **Confirm subscription** in the AWS SNS
email. Until confirmed, budget alerts are not delivered.

#### Test by adjusting forecast / limit

```bash
cd terraform/environments/staging
# Temporarily lower the limit so forecast/actual exceeds it
terraform apply -var='budget_limit_amount=1'
# Confirm SNS email received, then restore
terraform apply -var='budget_limit_amount=150'
```

Alternatively, in **AWS Budgets** console, lower the threshold percentage or
wait for the daily forecast refresh after a spend spike.

---

## Quick reference — Terraform module inputs

```hcl
module "monitoring" {
  source = "../../modules/monitoring"

  name_prefix         = var.name_prefix
  environment         = var.environment
  alert_email         = var.budget_alert_email
  budget_limit_amount = "150"
  create_budget       = true # staging only
  ecs_cluster_name    = module.ecs.cluster_name
  rds_instance_id     = module.rds.db_instance_id
  aws_region          = var.aws_region
  tags                = var.tags
}
```

Default alert email variable: `budget_alert_email` (override per environment /
`*.tfvars` as needed).
