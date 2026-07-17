variable "name_prefix" {
  description = "Prefix for ECS-related resource names"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the ECS security group"
  type        = string
}

variable "alb_security_group_id" {
  description = "ALB security group allowed to reach containers on 80/443"
  type        = string
}

variable "container_ingress_ports" {
  description = "Inbound ports allowed from the ALB"
  type        = list(number)
  default     = [80, 443]
}

variable "enable_container_insights" {
  description = "Enable CloudWatch Container Insights on the cluster"
  type        = bool
  default     = true
}

variable "create_execution_role" {
  description = "Create an ECS task execution IAM role in this module"
  type        = bool
  default     = true
}

variable "execution_role_arn" {
  description = "Existing execution role ARN when create_execution_role is false"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags applied to ECS resources"
  type        = map(string)
  default     = {}
}
