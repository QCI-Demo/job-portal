terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

locals {
  dashboard_name = "${var.name_prefix}-ops"

  # Cluster-level ECS metrics when no service is provisioned yet.
  ecs_cpu_metric = var.ecs_service_name == "" ? [
    ["AWS/ECS", "CPUUtilization", "ClusterName", var.ecs_cluster_name]
    ] : [
    ["AWS/ECS", "CPUUtilization", "ClusterName", var.ecs_cluster_name, "ServiceName", var.ecs_service_name]
  ]

  ecs_memory_metric = var.ecs_service_name == "" ? [
    ["AWS/ECS", "MemoryUtilization", "ClusterName", var.ecs_cluster_name]
    ] : [
    ["AWS/ECS", "MemoryUtilization", "ClusterName", var.ecs_cluster_name, "ServiceName", var.ecs_service_name]
  ]

  default_widgets = {
    widgets = [
      {
        type   = "text"
        x      = 0
        y      = 0
        width  = 24
        height = 1
        properties = {
          markdown = "# Job Portal — ${var.environment} operations dashboard\nECS/EKS health · RDS performance · estimated cost"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 1
        width  = 8
        height = 6
        properties = {
          title   = "ECS CPU Utilization"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          stat    = "Average"
          yAxis = {
            left = {
              min = 0
              max = 100
            }
          }
          metrics = local.ecs_cpu_metric
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 1
        width  = 8
        height = 6
        properties = {
          title   = "ECS Memory Utilization"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          stat    = "Average"
          yAxis = {
            left = {
              min = 0
              max = 100
            }
          }
          metrics = local.ecs_memory_metric
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 1
        width  = 8
        height = 6
        properties = {
          title   = "RDS CPU Utilization"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          stat    = "Average"
          yAxis = {
            left = {
              min = 0
              max = 100
            }
          }
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", var.rds_instance_id]
          ]
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 7
        width  = 8
        height = 6
        properties = {
          title   = "RDS Freeable Memory"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          stat    = "Average"
          metrics = [
            ["AWS/RDS", "FreeableMemory", "DBInstanceIdentifier", var.rds_instance_id]
          ]
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 7
        width  = 8
        height = 6
        properties = {
          title   = "RDS Database Connections"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          stat    = "Average"
          metrics = [
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", var.rds_instance_id]
          ]
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 7
        width  = 8
        height = 6
        properties = {
          # Billing metrics are published to us-east-1 only.
          title   = "Total Estimated Charges (USD)"
          region  = "us-east-1"
          view    = "timeSeries"
          stacked = false
          period  = 21600
          stat    = "Maximum"
          metrics = [
            ["AWS/Billing", "EstimatedCharges", "Currency", "USD"]
          ]
        }
      }
    ]
  }
}

# ---------------------------------------------------------------------------
# SNS topic + email subscription (tech lead)
# ---------------------------------------------------------------------------

resource "aws_sns_topic" "budget_alerts" {
  name = "${var.name_prefix}-budget-alerts"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-budget-alerts"
  })
}

resource "aws_sns_topic_subscription" "budget_email" {
  topic_arn = aws_sns_topic.budget_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ---------------------------------------------------------------------------
# AWS Budget — alert when projected monthly spend exceeds limit
# ---------------------------------------------------------------------------

resource "aws_budgets_budget" "monthly" {
  count = var.create_budget ? 1 : 0

  name              = "${var.name_prefix}-monthly"
  budget_type       = "COST"
  limit_amount      = var.budget_limit_amount
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2024-01-01_00:00"

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = var.budget_threshold_percent
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_sns_topic_arns = [aws_sns_topic.budget_alerts.arn]
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = var.budget_threshold_percent
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_sns_topic_arns = [aws_sns_topic.budget_alerts.arn]
  }

  cost_types {
    include_credit             = false
    include_discount           = true
    include_other_subscription = true
    include_recurring          = true
    include_refund             = false
    include_subscription       = true
    include_support            = true
    include_tax                = true
    include_upfront            = true
    use_amortized              = false
    use_blended                = false
  }
}

# Allow Budgets to publish to the SNS topic
data "aws_iam_policy_document" "budget_sns" {
  statement {
    sid    = "AllowBudgetsPublish"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["budgets.amazonaws.com"]
    }

    actions   = ["SNS:Publish"]
    resources = [aws_sns_topic.budget_alerts.arn]
  }
}

resource "aws_sns_topic_policy" "budget_alerts" {
  arn    = aws_sns_topic.budget_alerts.arn
  policy = data.aws_iam_policy_document.budget_sns.json
}

# ---------------------------------------------------------------------------
# CloudWatch dashboard — ECS CPU, RDS CPU, total cost (+ memory/health)
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_dashboard" "job_portal" {
  dashboard_name = local.dashboard_name
  # Prepare JSON widget definition (var.widgets override or module defaults).
  dashboard_body = jsonencode(var.widgets != null ? var.widgets : local.default_widgets)
}
