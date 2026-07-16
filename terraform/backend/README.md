# Terraform Remote State Backend

Bootstraps a secure Terraform remote state backend using an S3 bucket with
server-side encryption, versioning, and a DynamoDB table for state locking.
Access is restricted to the CI/CD IAM role via bucket policy and an attached
IAM policy.

## Resources

- `aws_s3_bucket` with private ACL and versioning enabled
- SSE-S3 encryption and public access block
- `aws_dynamodb_table` with `hash_key = "LockID"` and `billing_mode = "PAY_PER_REQUEST"`
- IAM policy allowing `s3:PutObject`, `s3:GetObject`, and `dynamodb:PutItem` for the CI/CD role

## Usage

```hcl
module "remote_state" {
  source = "../backend"

  name_prefix         = "job-portal"
  bucket_name         = "job-portal-terraform-state-<account-id>"
  dynamodb_table_name = "job-portal-terraform-locks"
  cicd_role_arn       = module.iam.cicd_role_arn

  tags = {
    Project = "job-portal"
  }
}
```

After apply, configure environment backends:

```hcl
terraform {
  backend "s3" {
    bucket         = "job-portal-terraform-state-<account-id>"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "job-portal-terraform-locks"
    encrypt        = true
  }
}
```

## Apply in a dedicated workspace

```bash
cd terraform/backend
terraform init
terraform workspace new bootstrap || terraform workspace select bootstrap
terraform plan -var-file=bootstrap.tfvars
terraform apply -var-file=bootstrap.tfvars
```
