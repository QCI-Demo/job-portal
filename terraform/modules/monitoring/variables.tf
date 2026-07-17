variable "name_prefix" {
  description = "Resource name prefix (e.g. job-portal-staging)"
  type        = string
}

variable "environment" {
  description = "Environment name used in budget and dashboard naming"
  type        = string
}

variable "alert_email" {
  description = "Email address for budget SNS notifications (ops / tech lead)"
  type        = string
}

variable "budget_limit_amount" {
  description = "Monthly AWS Budget limit in USD"
  type        = string
  default     = "150"
}

variable "budget_threshold_percent" {
  description = "Percent of budget that triggers FORECASTED notification"
  type        = number
  default     = 100
}

variable "create_budget" {
  description = "Whether to create the account-level AWS Budget (enable in one environment only)"
  type        = bool
  default     = true
}

variable "ecs_cluster_name" {
  description = "ECS cluster name for CPU/memory widgets"
  type        = string
}

variable "ecs_service_name" {
  description = "Optional ECS service name; when empty, cluster-level aggregates are used"
  type        = string
  default     = ""
}

variable "rds_instance_id" {
  description = "RDS DB instance identifier for CPU/memory widgets"
  type        = string
}

variable "aws_region" {
  description = "Primary AWS region for operational metrics"
  type        = string
  default     = "us-east-1"
}

variable "widgets" {
  description = <<-EOT
    Full CloudWatch dashboard body object for jsonencode(var.widgets).
    When null, the module builds defaults (ECS CPU/memory, RDS CPU/memory,
    connections, and estimated total cost).
  EOT
  type        = any
  default     = null
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}
