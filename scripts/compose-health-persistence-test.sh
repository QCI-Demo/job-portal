#!/usr/bin/env bash
# Validate compose health checks and database volume persistence across restarts.
#
# Prerequisites: Docker with compose v2, repository root as cwd.
# Usage:
#   cp .env.docker.example .env
#   ./scripts/compose-health-persistence-test.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

COMPOSE=(docker compose)
if ! docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
fi

POSTGRES_USER="${POSTGRES_USER:-jobportal}"
POSTGRES_DB="${POSTGRES_DB:-jobportal}"
MARKER_TABLE="_compose_persistence_test"
MARKER_VALUE="persist-$(date +%s)"

cleanup() {
  "${COMPOSE[@]}" down -v --remove-orphans >/dev/null 2>&1 || true
}

wait_for_healthy() {
  local service="$1"
  local attempts="${2:-60}"
  local i

  for ((i = 1; i <= attempts; i++)); do
    local container_id status
    container_id="$("${COMPOSE[@]}" ps -q "${service}" 2>/dev/null || true)"
    if [[ -z "${container_id}" ]]; then
      sleep 2
      continue
    fi
    status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
    if [[ "${status}" == "healthy" ]]; then
      echo "  ${service}: healthy"
      return 0
    fi
    sleep 2
  done

  echo "ERROR: ${service} did not become healthy in time" >&2
  "${COMPOSE[@]}" ps
  "${COMPOSE[@]}" logs --tail=50 "${service}" >&2 || true
  return 1
}

container_started_at() {
  local service="$1"
  local container_id
  container_id="$("${COMPOSE[@]}" ps -q "${service}")"
  docker inspect --format='{{.State.StartedAt}}' "${container_id}"
}

assert_all_healthy() {
  local service
  for service in database backend frontend; do
    wait_for_healthy "${service}"
  done
}

echo "==> Starting stack (fresh volume)"
cleanup
cp -n .env.docker.example .env 2>/dev/null || true
"${COMPOSE[@]}" up --build -d

echo "==> Waiting for compose health checks"
assert_all_healthy

echo "==> Verifying depends_on startup order (backend after database, frontend after backend)"
db_started="$(container_started_at database)"
be_started="$(container_started_at backend)"
fe_started="$(container_started_at frontend)"
[[ "${be_started}" > "${db_started}" ]] || {
  echo "ERROR: backend started before database was ready" >&2
  exit 1
}
[[ "${fe_started}" > "${be_started}" ]] || {
  echo "ERROR: frontend started before backend was ready" >&2
  exit 1
}
echo "  startup order OK"

echo "==> Recording persistence marker in database"
"${COMPOSE[@]}" exec -T database psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 <<SQL
CREATE TABLE IF NOT EXISTS ${MARKER_TABLE} (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  marker text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO ${MARKER_TABLE} (id, marker)
VALUES (1, '${MARKER_VALUE}')
ON CONFLICT (id) DO UPDATE
SET marker = EXCLUDED.marker, created_at = now();
SQL

stored_marker="$("${COMPOSE[@]}" exec -T database psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc \
  "SELECT marker FROM ${MARKER_TABLE} WHERE id = 1;")"
stored_marker="$(echo "${stored_marker}" | tr -d '[:space:]')"
[[ "${stored_marker}" == "${MARKER_VALUE}" ]] || {
  echo "ERROR: failed to write persistence marker (got '${stored_marker}')" >&2
  exit 1
}
echo "  marker stored: ${MARKER_VALUE}"

echo "==> Restarting all services (volume retained)"
"${COMPOSE[@]}" restart database backend frontend
assert_all_healthy

echo "==> Verifying data survived restart"
restored_marker="$("${COMPOSE[@]}" exec -T database psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc \
  "SELECT marker FROM ${MARKER_TABLE} WHERE id = 1;")"
restored_marker="$(echo "${restored_marker}" | tr -d '[:space:]')"
[[ "${restored_marker}" == "${MARKER_VALUE}" ]] || {
  echo "ERROR: persistence marker lost after restart (got '${restored_marker}')" >&2
  exit 1
}
echo "  marker restored: ${restored_marker}"

echo "==> Recreating database container (same named volume)"
"${COMPOSE[@]}" up -d --force-recreate --no-deps database
wait_for_healthy database

recreated_marker="$("${COMPOSE[@]}" exec -T database psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc \
  "SELECT marker FROM ${MARKER_TABLE} WHERE id = 1;")"
recreated_marker="$(echo "${recreated_marker}" | tr -d '[:space:]')"
[[ "${recreated_marker}" == "${MARKER_VALUE}" ]] || {
  echo "ERROR: persistence marker lost after database recreate (got '${recreated_marker}')" >&2
  exit 1
}
echo "  marker survived database recreate: ${recreated_marker}"

echo "==> External smoke checks"
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}" \
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}" \
  ./scripts/compose-smoke-test.sh

echo "==> Health check and persistence tests passed"
cleanup
