#!/usr/bin/env bash
# Fail the pipeline when Trivy reports any CRITICAL vulnerabilities.
# Usage: ./scripts/check_trivy.sh [trivy-report.json]

set -euo pipefail

REPORT="${1:-trivy-report.json}"

if [[ ! -f "$REPORT" ]]; then
  echo "ERROR: Trivy report not found: $REPORT" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required to parse the Trivy report" >&2
  exit 1
fi

CRITICAL_COUNT="$(
  jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "CRITICAL")] | length' "$REPORT"
)"

echo "CRITICAL findings: ${CRITICAL_COUNT}"

if [[ "$CRITICAL_COUNT" -gt 0 ]]; then
  echo "Failing pipeline: ${CRITICAL_COUNT} CRITICAL CVE(s) found in ${REPORT}" >&2
  jq -r '
    .Results[]?.Vulnerabilities[]?
    | select(.Severity == "CRITICAL")
    | "- \(.VulnerabilityID // "unknown") (\(.PkgName // "n/a")): \(.Title // .Description // "")"
  ' "$REPORT" >&2 || true
  exit 1
fi

echo "No CRITICAL findings; security gate passed."
exit 0
