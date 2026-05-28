# Sample Data Specification

Structured seed records for development and automated testing. Canonical source: **`seed-data.json`**. CSV exports (`users.csv`, `jobs.csv`, `applications.csv`) mirror the same rows for spreadsheet review.

All seeded user accounts share the development password **`Password123!`** (bcrypt hash stored in `seed-data.json` → `meta.devPasswordHash`).

## Entity attributes

### `roles`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `name` | string (2–64, lowercase) | yes | Unique; seeded: `candidate`, `employer`, `admin` |
| `description` | string (≤255) | no | Human-readable role summary |

Inserted by the initial migration and upserted by the seed script for idempotency.

### `users`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID | yes | Fixed UUIDs in seed data for stable references in tests |
| `email` | string (3–320) | yes | Case-insensitive unique (`lower(email)`) |
| `password_hash` | string (≤255) | yes | Bcrypt hash; same dev password for all sample users |
| `display_name` | string (1–120) | yes | Shown in UI and reporting joins |
| `email_verified_at` | timestamptz | no | Null = unverified inbox |
| `status` | enum | yes | `active`, `suspended`, `deleted` |
| `metadata` | JSONB | yes | Scenario tags and optional profile hints |
| `roles` | string[] | yes (seed) | Resolved into `user_roles` rows |

### `jobs`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID | yes | Fixed UUID for test stability |
| `employer_user_id` | UUID | yes | FK → `users`; employer must hold `employer` role at app layer |
| `title` | string (3–200) | yes | Indexed with `lower(title)` |
| `description` | text | yes | Full listing body |
| `location` | string (≤200) | no | Remote, hybrid, or city |
| `employment_type` | string (≤64) | no | e.g. `full_time`, `part_time`, `contract`, `internship` |
| `salary_min_cents` / `salary_max_cents` | integer | no | Must satisfy `min ≤ max` when both set |
| `currency_code` | char(3) | yes | Default `USD` |
| `status` | enum | yes | `draft`, `published`, `closed`, `archived` |
| `published_at` / `closes_at` | timestamptz | no | Null for drafts |
| `metadata` | JSONB | yes | Scenario tags |

### `applications`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `id` | UUID | yes | Fixed UUID for test stability |
| `job_id` | UUID | yes | FK → `jobs` |
| `candidate_user_id` | UUID | yes | FK → `users` |
| `status` | enum | yes | `submitted`, `in_review`, `shortlisted`, `rejected`, `withdrawn`, `hired` |
| `cover_letter` | text | no | Application narrative |
| `resume_url` | string (≤2048) | no | Null allowed (see rejected application edge case) |
| `metadata` | JSONB | yes | Scenario tags |

Unique constraint: one application per `(job_id, candidate_user_id)`.

## Record inventory

| Entity | Count | Coverage |
|--------|-------|----------|
| Roles | 3 | All platform roles |
| Users | 11 | 3 employers, 5 candidates, 1 admin, 1 multi-role, edge statuses |
| Jobs | 8 | All four statuses; all major employment types |
| Applications | 7 | All six application statuses represented |

## Edge cases covered

| Scenario | Seed record |
|----------|-------------|
| Employer with no jobs | `inactive-employer@example.com` |
| Candidate with no applications | `new-grad@example.com` |
| Published job with no applications | Product Manager (`…2204`) |
| Draft job with no applications | DevOps Engineer (`…2202`) |
| Suspended user account | `suspended-employer@example.com` |
| Deleted user account | `deleted-candidate@example.com` |
| User with multiple roles | `multi-role@example.com` (candidate + employer) |
| Job from suspended employer | Marketing Lead (`…2206`) |
| Application without resume URL | rejected application (`…3304`) |
| Withdrawn / hired terminal states | applications `…3305`, `…3306` |
| Multiple candidates on same job | Senior Backend Engineer (2 applications) |
| Archived job listing | Software Engineering Intern (`…2207`) |

## Test account quick reference

| Email | Password | Role(s) | Purpose |
|-------|----------|---------|---------|
| `admin@example.com` | `Password123!` | admin | Platform administration |
| `employer@example.com` | `Password123!` | employer | Primary employer flows |
| `candidate@example.com` | `Password123!` | candidate | Primary candidate flows |
| `hiring@acmecorp.com` | `Password123!` | employer | Multi-job employer |
| `inactive-employer@example.com` | `Password123!` | employer | Empty job list |
| `new-grad@example.com` | `Password123!` | candidate | Empty application list |
| `multi-role@example.com` | `Password123!` | candidate, employer | Dual-role authorization |
| `rejected-only@example.com` | `Password123!` | candidate | Single rejected application |
