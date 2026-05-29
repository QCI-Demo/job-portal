#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PGHOST="${PGHOST:-127.0.0.1}"
export PGPORT="${PGPORT:-5433}"
export PGUSER="${PGUSER:-jobportal}"
export PGPASSWORD="${PGPASSWORD:-jobportal}"
export PGDATABASE="${PGDATABASE:-jobportal}"

cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to run this validation script" >&2
  exit 1
fi

docker compose up -d database

for _ in $(seq 1 40); do
  if docker compose exec -T database pg_isready -U "$PGUSER" -d "$PGDATABASE" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

psql -v ON_ERROR_STOP=1 -f "$ROOT/db/migrations/000001_initial_job_portal_schema.down.sql"
psql -v ON_ERROR_STOP=1 -f "$ROOT/db/migrations/000001_initial_job_portal_schema.up.sql"
psql -v ON_ERROR_STOP=1 -f "$ROOT/db/sample_queries.sql"

echo "Schema validation queries completed successfully."
