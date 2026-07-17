# VPC Module

Reusable VPC with public and private subnets across two (or more) availability
zones, internet gateway, NAT gateway, route tables, and a default application
security group.

## Features

- `aws_vpc` with DNS hostnames/support enabled
- Public and private `aws_subnet` per AZ
- `aws_internet_gateway` for public egress/ingress
- `aws_nat_gateway` for private subnet egress
- Public and private `aws_route_table` resources with associations
- Default deny-ingress application security group

## Usage

```hcl
module "vpc" {
  source = "../../modules/vpc"

  name_prefix        = "job-portal-dev"
  cidr_block         = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
  public_subnet_cidrs  = ["10.0.0.0/24", "10.0.1.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true

  tags = {
    Project     = "job-portal"
    Environment = "dev"
  }
}
```

## Outputs

| Name | Description |
|------|-------------|
| `vpc_id` | VPC ID |
| `public_subnet_ids` | Public subnet IDs |
| `private_subnet_ids` | Private subnet IDs |
| `nat_gateway_id` | Primary NAT gateway ID |
| `default_app_security_group_id` | Default app SG ID |
