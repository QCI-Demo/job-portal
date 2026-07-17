output "cicd_role_arn" {
  description = "ARN of the CI/CD IAM role"
  value       = aws_iam_role.cicd.arn
}

output "cicd_role_name" {
  description = "Name of the CI/CD IAM role"
  value       = aws_iam_role.cicd.name
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution IAM role"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "rds_access_role_arn" {
  description = "ARN of the RDS access IAM role"
  value       = aws_iam_role.rds_access.arn
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub OIDC provider in use"
  value       = local.oidc_provider_arn
}

output "eks_cluster_role_arn" {
  description = "ARN of the optional EKS cluster IAM role"
  value       = try(aws_iam_role.eks_cluster[0].arn, null)
}

output "eks_node_role_arn" {
  description = "ARN of the optional EKS node IAM role"
  value       = try(aws_iam_role.eks_node[0].arn, null)
}
