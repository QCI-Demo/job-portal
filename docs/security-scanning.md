# Story Execution: Integrate Security Scanning and Artifact Management

**Story ID:** 1883e3c4-9ad4-429f-8ced-9f14090f0aeb

## Summary

Embeds Trivy container image scanning into the Job Portal CI/CD pipeline,
enforces a fail-fast policy on CRITICAL vulnerabilities, retains scan
artifacts for 30 days, and notifies the DevOps lead via Slack when a scan
fails. Only images that pass the security gate proceed to staging and
production.

## Workflow changes

File: [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml)

### Updated job graph

```
checkout
   ├── lint (ESLint / frontend)
   └── test (pytest / backend)
            └── build (Docker → ECR)          [push | workflow_dispatch]
                     └── security-scan (Trivy)
                              └── terraform-apply-staging
                                       └── approval (environment: prod-approval)
                                                └── terraform-apply-prod
```

### `security-scan` job

1. Authenticate to AWS / ECR and resolve the image URI.
2. `docker pull` the image tagged with `${{ github.sha }}`.
3. Install Trivy and run:
   `trivy image --severity HIGH,CRITICAL --format json -o trivy-report.json <image>:<sha>`
4. Upload `trivy-report.json` via `actions/upload-artifact` (retention: 30 days).
5. Run [`scripts/check_trivy.sh`](../scripts/check_trivy.sh) to fail on CRITICAL CVEs.
6. On job `failure()`, send a Slack webhook message with the commit SHA and
   workflow run URL (`slackapi/slack-github-action`).

## Tasks completed

| Task | ID | Deliverable |
|------|-----|-------------|
| Fail on CRITICAL | 5a15d97f-b03e-48d7-8805-5d405ae42c18 | `scripts/check_trivy.sh` (`jq` count of CRITICAL; exit 1 if > 0) |
| Trivy install & scan | 073cc27b-60e6-46e1-a2bd-461efcfc28da | Install Trivy, scan image, upload `trivy-report` artifact |
| Failure notification | e2fa313e-5be8-4437-8560-4e87bbce89db | Slack step on `if: failure()` with SHA + run link |

## Required GitHub configuration

| Name | Type | Purpose |
|------|------|---------|
| `SLACK_WEBHOOK_URL` | Secret | Incoming webhook for DevOps lead notifications |
| `AWS_ROLE_ARN` | Secret | IAM role for ECR pull (existing) |
| `ECR_REPO` | Variable | ECR repository name or full URI (existing) |

## Local verification

```bash
# Fail-fast script (clean report → exit 0)
echo '{"Results":[]}' > /tmp/trivy-report.json
bash scripts/check_trivy.sh /tmp/trivy-report.json

# Fail-fast script (CRITICAL present → exit 1)
echo '{"Results":[{"Vulnerabilities":[{"VulnerabilityID":"CVE-1","Severity":"CRITICAL","PkgName":"x","Title":"t"}]}]}' \
  > /tmp/trivy-report.json
bash scripts/check_trivy.sh /tmp/trivy-report.json; echo "exit=$?"
```
