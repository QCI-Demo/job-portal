#!/usr/bin/env bash
# Write a docker-compose .env file from environment variables (e.g. GitHub Secrets).
# Never prints secret values to stdout.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

SOURCE="${COMPOSE_ENV_SOURCE:-.env.docker.example}"
TARGET="${COMPOSE_ENV_TARGET:-.env}"

if [[ ! -f "${SOURCE}" ]]; then
  echo "ERROR: missing source env template: ${SOURCE}" >&2
  exit 1
fi

cp "${SOURCE}" "${TARGET}"

set_kv() {
  local key="$1"
  local value="$2"
  if [[ -z "${value}" ]]; then
    return 0
  fi
  echo "::add-mask::${value}" 2>/dev/null || true
  python3 - "${key}" "${value}" "${TARGET}" <<'PY'
import re
import sys

key, value, path = sys.argv[1], sys.argv[2], sys.argv[3]
text = open(path, encoding="utf-8").read()
pattern = rf"^{re.escape(key)}=.*$"
replacement = f"{key}={value}"
if re.search(pattern, text, flags=re.MULTILINE):
    text = re.sub(pattern, replacement, text, count=1, flags=re.MULTILINE)
else:
    text = text.rstrip() + f"\n{replacement}\n"
open(path, "w", encoding="utf-8").write(text)
PY
}

set_kv "POSTGRES_USER" "${POSTGRES_USER:-}"
set_kv "POSTGRES_PASSWORD" "${POSTGRES_PASSWORD:-}"
set_kv "POSTGRES_DB" "${POSTGRES_DB:-}"
set_kv "DATABASE_URL" "${DATABASE_URL:-}"
set_kv "DOCKER_REGISTRY_TOKEN" "${DOCKER_REGISTRY_TOKEN:-}"

echo "materialize-compose-env: wrote ${TARGET} from ${SOURCE} (values not printed)"
