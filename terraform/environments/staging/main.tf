terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }

  # After bootstrap, migrate state with:
  # terraform init -migrate-state
  # backend "s3" {
  #   bucket         = "job-portal-terraform-state-<account-id>"
  #   key            = "staging/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "job-portal-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}

variable "name_prefix" {
  description = "Resource name prefix"
  type        = string
  default     = "job-portal-staging"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.10.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "github_repository" {
  description = "GitHub repository for OIDC trust"
  type        = string
  default     = "QCI-Demo/job-portal"
}

variable "create_oidc_provider" {
  description = "Create GitHub OIDC provider (false when shared with another env)"
  type        = bool
  default     = false
}

variable "github_oidc_provider_arn" {
  description = "Existing GitHub OIDC provider ARN"
  type        = string
  default     = ""
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default = {
    Project     = "job-portal"
    ManagedBy   = "terraform"
    Environment = "staging"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-alb-sg"
  description = "ALB security group for ECS ingress reference"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-alb-sg"
  })
}

module "iam" {
  source = "../../modules/iam"

  name_prefix              = var.name_prefix
  github_repository        = var.github_repository
  create_oidc_provider     = var.create_oidc_provider
  github_oidc_provider_arn = var.github_oidc_provider_arn
  state_bucket_arn         = "arn:aws:s3:::job-portal-terraform-state-${data.aws_caller_identity.current.account_id}"
  state_lock_table_arn     = "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/job-portal-terraform-locks"

  tags = var.tags
}

module "vpc" {
  source = "../../modules/vpc"

  name_prefix          = var.name_prefix
  cidr_block           = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = ["10.10.0.0/24", "10.10.1.0/24"]
  private_subnet_cidrs = ["10.10.10.0/24", "10.10.11.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true

  tags = var.tags
}

module "ecs" {
  source = "../../modules/ecs"

  name_prefix           = var.name_prefix
  vpc_id                = module.vpc.vpc_id
  alb_security_group_id = aws_security_group.alb.id
  create_execution_role = false
  execution_role_arn    = module.iam.ecs_task_execution_role_arn

  tags = var.tags
}

module "rds" {
  source = "../../modules/rds"

  name_prefix                 = var.name_prefix
  vpc_id                      = module.vpc.vpc_id
  subnet_ids                  = module.vpc.private_subnet_ids
  allowed_security_group_ids  = [module.ecs.security_group_id]
  instance_class              = var.db_instance_class
  engine_version              = "15.4"
  db_name                     = "jobportal"
  username                    = "jobportal_admin"
  manage_master_user_password = true
  backup_retention_period     = 7
  multi_az                    = false
  skip_final_snapshot         = true
  deletion_protection         = false

  tags = var.tags
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "nat_gateway_id" {
  value = module.vpc.nat_gateway_id
}

output "ecs_cluster_arn" {
  value = module.ecs.cluster_arn
}

output "ecs_task_execution_role_arn" {
  value = module.iam.ecs_task_execution_role_arn
}

output "cicd_role_arn" {
  value = module.iam.cicd_role_arn
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "rds_port" {
  value = module.rds.port
}
