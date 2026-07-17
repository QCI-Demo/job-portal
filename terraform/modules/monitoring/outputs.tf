output "dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = aws_cloudwatch_dashboard.job_portal.dashboard_name
}

output "dashboard_arn" {
  description = "CloudWatch dashboard ARN"
  value       = aws_cloudwatch_dashboard.job_portal.dashboard_arn
}

output "sns_topic_arn" {
  description = "SNS topic ARN for budget alerts"
  value       = aws_sns_topic.budget_alerts.arn
}

output "budget_name" {
  description = "AWS Budget name (null when create_budget is false)"
  value       = try(aws_budgets_budget.monthly[0].name, null)
}

output "budget_limit_amount" {
  description = "Configured monthly budget limit in USD"
  value       = var.budget_limit_amount
}
