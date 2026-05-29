#!/usr/bin/env bash
# Smoke test for docker compose stack — run after `docker compose up -d`.
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

echo "==> Backend health"
health_json="$(curl -sf "${BACKEND_URL}/health")"
echo "${health_json}"
echo "${health_json}" | grep -q '"status":"ok"'

echo "==> Backend jobs API (database connectivity)"
jobs_json="$(curl -sf "${BACKEND_URL}/api/jobs")"
echo "${jobs_json}" | grep -q '"data"'

echo "==> Frontend health"
curl -sf "${FRONTEND_URL}/health" | grep -q 'ok'

echo "==> All smoke checks passed"
