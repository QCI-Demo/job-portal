#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIRS=(
  "$ROOT/modules/iam"
  "$ROOT/modules/vpc"
  "$ROOT/modules/rds"
  "$ROOT/modules/ecs"
  "$ROOT/backend"
  "$ROOT/environments/dev"
  "$ROOT/environments/staging"
  "$ROOT/environments/production"
)

echo "==> terraform fmt -check -recursive"
terraform fmt -check -recursive "$ROOT"

for dir in "${DIRS[@]}"; do
  echo "==> validating $dir"
  (
    cd "$dir"
    terraform init -backend=false -input=false >/dev/null
    terraform validate
  )
done

echo "==> all modules validated successfully"
