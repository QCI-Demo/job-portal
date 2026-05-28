# Database seeding

Sample data for local development and automated testing. Canonical records live in **`db/seed-data/seed-data.json`** with CSV exports and attribute documentation in **`db/seed-data/README.md`**.

The Prisma seed script (`prisma/seed.js`) upserts fixed-UUID rows so it is **safe to re-run** without duplicating data.

## Prerequisites

Complete the [migration setup](database-migrations.md) first:

```bash
cp .env.example .env
docker compose up -d postgres
npm install && npm run prisma:generate
npm run migrate:deploy
```

## Run the seed

```bash
npm run db:seed
```

Expected output:

```text
Seed complete: 3 roles, 11 users, 8 jobs, 7 applications.
```

## Validate seeded data

After seeding, confirm counts, referential integrity, and edge-case coverage:

```bash
npm run db:seed:validate
```

This runs `scripts/validate_seed.js`, which exits non-zero on failure (CI-friendly).

## Reset and re-seed (development)

To drop all tables, re-apply migrations, and run the seed in one step:

```bash
npm run db:reset
```

`prisma migrate reset` prompts for confirmation in interactive terminals. In CI, set `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` or pipe confirmation as documented by Prisma for your environment.

Manual reset alternative:

```bash
docker compose down -v
docker compose up -d postgres
npm run migrate:deploy
npm run db:seed
npm run db:seed:validate
```

## What gets seeded

| Entity | Count | Notes |
|--------|-------|-------|
| Roles | 3 | `candidate`, `employer`, `admin` (also inserted by initial migration) |
| Users | 11 | Admins, employers, candidates, multi-role, suspended/deleted edge cases |
| Jobs | 8 | All statuses (`draft`, `published`, `closed`, `archived`) and employment types |
| Applications | 7 | All application statuses; includes withdrawn, hired, and no-resume cases |

All sample users use password **`Password123!`**. See **`db/seed-data/README.md`** for the test account matrix.

### Edge cases included

- Employer with **no jobs** (`inactive-employer@example.com`)
- Candidate with **no applications** (`new-grad@example.com`)
- **Published job with no applications** (Product Manager)
- **Draft job** with no applications (DevOps Engineer)
- **Suspended** and **deleted** user accounts
- **Multi-role** user (candidate + employer)
- Job posted by a **suspended** employer
- Application **without resume URL**

## Idempotency

The seed script uses Prisma `upsert` keyed by:

- `roles.name`
- Fixed `users.id`, `jobs.id`, `applications.id`
- Composite `(user_id, role_id)` for `user_roles`

Re-running `npm run db:seed` updates existing rows in place and does not create duplicates.

## SQL-only workflow

If you apply raw SQL migrations instead of Prisma (see [database-migrations.md](database-migrations.md)), run the Prisma seed against the same database after `000001`…`up.sql`:

```bash
export DATABASE_URL="postgresql://jobportal:jobportal@localhost:5433/jobportal?schema=public"
npm run prisma:generate
npm run db:seed
npm run db:seed:validate
```

Do **not** apply both Prisma migrations and raw SQL to the same database.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `Environment variable not found: DATABASE_URL` | Missing `.env` | Copy `.env.example` to `.env` and set `DATABASE_URL` |
| `P1001: Can't reach database server` | Postgres not running | `docker compose up -d postgres` and verify port **5433** |
| `Foreign key constraint failed` on seed | Migrations not applied | Run `npm run migrate:deploy` first |
| `Unique constraint failed` on email | Conflicting non-seed rows | Reset dev DB (`npm run db:reset`) or remove conflicting emails |
| Seed validation fails on counts | Partial seed or manual deletes | Re-run `npm run db:seed` |
| `Unknown role` during seed | Roles missing | Ensure initial migration ran (roles are inserted in `000001`) |
| Duplicate data after re-seed | Custom inserts without fixed UUIDs | Use seed UUIDs from `seed-data.json` or reset the database |

## CI integration

The GitHub Actions workflow (`.github/workflows/validate-db-schema.yml`) can run Prisma migrate + seed + validation. Locally, mirror CI with:

```bash
npm run test:seed
```

This applies migrations to the database configured in `.env.test` (or `.env`), seeds, and validates.
