output "state_bucket_id" {
  description = "S3 bucket ID for Terraform remote state"
  value       = aws_s3_bucket.terraform_state.id
}

output "state_bucket_arn" {
  description = "S3 bucket ARN for Terraform remote state"
  value       = aws_s3_bucket.terraform_state.arn
}

output "lock_table_name" {
  description = "DynamoDB table name for state locking"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "lock_table_arn" {
  description = "DynamoDB table ARN for state locking"
  value       = aws_dynamodb_table.terraform_locks.arn
}

output "cicd_state_access_policy_arn" {
  description = "IAM policy ARN granting CI/CD access to state resources"
  value       = aws_iam_policy.cicd_state_access.arn
}

output "backend_config" {
  description = "Suggested Terraform backend configuration values"
  value = {
    bucket         = aws_s3_bucket.terraform_state.id
    dynamodb_table = aws_dynamodb_table.terraform_locks.name
    encrypt        = true
  }
}
