# Story Execution: Integrate Security Scanning and Artifact Management

**Story ID:** 1883e3c4-9ad4-429f-8ced-9f14090f0aeb

## Summary

Embeds Trivy container image scanning into the Job Portal CI/CD pipeline,
enforces a fail-fast policy on CRITICAL vulnerabilities, retains scan JSON
artifacts for 30 days, and notifies the DevOps lead via Slack when the
`security-scan` job fails. Only images that pass the gate proceed to staging
and production Terraform applies.

## Workflow changes

File: [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml)

### Updated job graph

```
checkout
   ├── lint (ESLint / frontend)
   └── test (pytest / backend)
            └── build (Docker → ECR)                [push | workflow_dispatch]
                     └── security-scan (Trivy)      [fail-fast on CRITICAL]
                              ├── artifact: trivy-report (30-day retention)
                              ├── Slack notify on failure
                              └── terraform-apply-staging
                                       └── approval (environment: prod-approval)
                                                └── terraform-apply-prod
```

## Tasks completed

| Task | ID | Deliverable |
|------|-----|-------------|
| Fail on CRITICAL | 5a15d97f-b03e-48d7-8805-5d405ae42c18 | [`scripts/check_trivy.sh`](../scripts/check_trivy.sh) — `jq` counts CRITICAL CVEs; exit 1 if count > 0 |
| Trivy install + scan | 073cc27b-60e6-46e1-a2bd-461efcfc28da | `security-scan` job: install Trivy, `docker pull`, `trivy image --severity HIGH,CRITICAL --format json -o trivy-report.json`, `actions/upload-artifact` |
| Failure notification | e2fa313e-5be8-4437-8560-4e87bbce89db | `slackapi/slack-github-action` step with `if: failure()`, includes commit SHA and workflow run URL |

## Security scan steps

1. Assume AWS role and log in to ECR.
2. Resolve `ECR_REPO` to a full image URI when a short name is configured.
3. Install Trivy via the official install script.
4. `docker pull ${{ env.ECR_REPO }}:${{ github.sha }}`.
5. `trivy image --severity HIGH,CRITICAL --format json -o trivy-report.json ${{ env.ECR_REPO }}:${{ github.sha }}`.
6. Upload `trivy-report.json` as artifact `trivy-report` (`retention-days: 30`).
7. Run `scripts/check_trivy.sh trivy-report.json` (fails job on any CRITICAL finding).
8. On job failure, post to Slack webhook with commit SHA and run link.

## Required GitHub configuration

| Name | Type | Purpose |
|------|------|---------|
| `SLACK_WEBHOOK_URL` | Secret | Incoming webhook URL for DevOps lead notifications (`slackapi/slack-github-action`) |
| `AWS_ROLE_ARN` | Secret | IAM role for ECR pull during scan (existing) |
| `ECR_REPO` | Variable | ECR repository name or full URI (existing) |

Create an Incoming Webhook in the DevOps Slack channel and store the URL as
repository secret `SLACK_WEBHOOK_URL`. Do not commit webhook URLs or tokens.

## Local verification

```bash
# Gate script with no CRITICAL findings
echo '{"Results":[{"Vulnerabilities":[{"Severity":"HIGH","VulnerabilityID":"CVE-1"}]}]}' > /tmp/trivy-ok.json
./scripts/check_trivy.sh /tmp/trivy-ok.json   # exit 0

# Gate script with CRITICAL findings
echo '{"Results":[{"Vulnerabilities":[{"Severity":"CRITICAL","VulnerabilityID":"CVE-2","PkgName":"openssl","Title":"crit"}]}]}' > /tmp/trivy-crit.json
./scripts/check_trivy.sh /tmp/trivy-crit.json # exit 1
```
