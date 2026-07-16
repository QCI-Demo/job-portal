# ECS Cluster Module

Provisions an Amazon ECS cluster (Fargate), an IAM task execution role with
`AmazonECSTaskExecutionRolePolicy`, and a security group allowing inbound
HTTP/HTTPS from an Application Load Balancer.

## Features

- `aws_ecs_cluster` with optional Container Insights
- Fargate and Fargate Spot capacity providers
- IAM role with `AmazonECSTaskExecutionRolePolicy` attached
- Security group allowing inbound 80/443 from ALB

## Usage

```hcl
module "ecs" {
  source = "../../modules/ecs"

  name_prefix           = "job-portal-dev"
  vpc_id                = module.vpc.vpc_id
  alb_security_group_id = aws_security_group.alb.id
  enable_container_insights = true

  tags = {
    Project     = "job-portal"
    Environment = "dev"
  }
}
```

## Outputs

| Name | Description |
|------|-------------|
| `cluster_arn` | ECS cluster ARN |
| `task_execution_role_arn` | Task execution role ARN |
| `security_group_id` | ECS security group ID |
