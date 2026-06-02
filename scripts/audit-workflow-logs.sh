#!/usr/bin/env bash
# Scan CI job output for patterns that often indicate accidental secret exposure.
# Safe to run locally:   ./scripts/audit-workflow-logs.sh --log-file path/to.log
set -euo pipefail

LOG_FILE="ci-step-output.log"
FAIL_ON_MATCH=1

usage() {
  cat <<'EOF'
Usage: audit-workflow-logs.sh [--log-file PATH] [--fail-on-match | --no-fail]

Scans a captured workflow log for high-risk credential patterns.
Exits 1 when --fail-on-match (default) and a pattern matches.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --log-file)
      LOG_FILE="${2:?}"
      shift 2
      ;;
    --fail-on-match)
      FAIL_ON_MATCH=1
      shift
      ;;
    --no-fail)
      FAIL_ON_MATCH=0
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ ! -f "${LOG_FILE}" ]]; then
  echo "audit-workflow-logs: no log file at ${LOG_FILE}; skipping scan"
  exit 0
fi

# Patterns that should not appear in CI logs (masked secrets are replaced with ***).
PATTERNS=(
  'ghp_[A-Za-z0-9]{20,}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'sk-[A-Za-z0-9]{20,}'
  'AKIA[0-9A-Z]{16}'
  '-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----'
  'postgresql://[^:@\s]+:[^@\s]+@'
  'mysql://[^:@\s]+:[^@\s]+@'
  'mongodb(\+srv)?://[^:@\s]+:[^@\s]+@'
  'password\s*=\s*[^\s*]{8,}'
  'api[_-]?key\s*=\s*[^\s*]{8,}'
  'Bearer\s+[A-Za-z0-9._-]{20,}'
)

matches=0
for pattern in "${PATTERNS[@]}"; do
  if grep -Eiq -- "${pattern}" "${LOG_FILE}"; then
    echo "::error::Possible secret exposure detected (pattern: ${pattern})"
    matches=$((matches + 1))
  fi
done

if [[ "${matches}" -gt 0 ]]; then
  echo "audit-workflow-logs: ${matches} suspicious pattern(s) in ${LOG_FILE}"
  if [[ "${FAIL_ON_MATCH}" -eq 1 ]]; then
    exit 1
  fi
else
  echo "audit-workflow-logs: no suspicious credential patterns in ${LOG_FILE}"
fi
