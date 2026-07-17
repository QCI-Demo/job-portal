variable "name_prefix" {
  description = "Prefix for remote state resources"
  type        = string
  default     = "job-portal"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for Terraform state"
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
  default     = "job-portal-terraform-locks"
}

variable "cicd_role_arn" {
  description = "ARN of the CI/CD IAM role allowed to access state"
  type        = string
}

variable "additional_principal_arns" {
  description = "Additional IAM principal ARNs allowed bucket/table access"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags applied to remote state resources"
  type        = map(string)
  default     = {}
}
