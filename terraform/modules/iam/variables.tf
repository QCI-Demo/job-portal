variable "name_prefix" {
  description = "Prefix applied to IAM role and policy names"
  type        = string
  default     = "job-portal"
}

variable "tags" {
  description = "Tags applied to all IAM resources"
  type        = map(string)
  default     = {}
}

variable "state_bucket_arn" {
  description = "ARN of the Terraform remote state S3 bucket"
  type        = string
  default     = "*"
}

variable "state_lock_table_arn" {
  description = "ARN of the Terraform state lock DynamoDB table"
  type        = string
  default     = "*"
}

variable "ecr_repository_arns" {
  description = "ECR repository ARNs the CI/CD role may push/pull"
  type        = list(string)
  default     = ["*"]
}

variable "create_oidc_provider" {
  description = "Whether to create a GitHub Actions OIDC provider (set false if one already exists)"
  type        = bool
  default     = false
}

variable "github_oidc_provider_arn" {
  description = "Existing GitHub OIDC provider ARN when create_oidc_provider is false"
  type        = string
  default     = ""
}

variable "github_repository" {
  description = "GitHub repository allowed to assume the CI/CD role (org/repo)"
  type        = string
  default     = "QCI-Demo/job-portal"
}

variable "rds_resource_arns" {
  description = "RDS resource ARNs for read/write access policy"
  type        = list(string)
  default     = ["*"]
}

variable "create_eks_roles" {
  description = "Create optional EKS cluster and node IAM roles (ECS is the default runtime)"
  type        = bool
  default     = false
}
