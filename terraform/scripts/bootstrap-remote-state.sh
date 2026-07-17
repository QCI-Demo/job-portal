#!/usr/bin/env bash
# Bootstrap Terraform remote state in a dedicated workspace.
# Requires AWS credentials with permission to create S3, DynamoDB, and IAM.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"

if [[ ! -f "$BACKEND/bootstrap.tfvars" ]]; then
  echo "Missing $BACKEND/bootstrap.tfvars"
  echo "Copy bootstrap.tfvars.example and set bucket_name + cicd_role_arn"
  exit 1
fi

cd "$BACKEND"
terraform init -input=false
terraform workspace new bootstrap 2>/dev/null || terraform workspace select bootstrap
terraform plan -var-file=bootstrap.tfvars -out=bootstrap.tfplan
terraform apply -input=false bootstrap.tfplan
terraform output -json > "$ROOT/../artifacts/backend-apply-outputs.json" 2>/dev/null || true
echo "Remote state backend applied in workspace: $(terraform workspace show)"
