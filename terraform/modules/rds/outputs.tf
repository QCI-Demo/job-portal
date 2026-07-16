output "db_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.this.id
}

output "db_instance_arn" {
  description = "RDS instance ARN"
  value       = aws_db_instance.this.arn
}

output "endpoint" {
  description = "RDS connection endpoint hostname"
  value       = aws_db_instance.this.address
}

output "port" {
  description = "RDS connection port"
  value       = aws_db_instance.this.port
}

output "security_group_id" {
  description = "Security group ID attached to the RDS instance"
  value       = aws_security_group.rds.id
}

output "db_subnet_group_name" {
  description = "DB subnet group name"
  value       = aws_db_subnet_group.this.name
}

output "master_user_secret_arn" {
  description = "Secrets Manager ARN for the managed master password (when enabled)"
  value       = try(aws_db_instance.this.master_user_secret[0].secret_arn, var.password_secret_arn)
  sensitive   = true
}
