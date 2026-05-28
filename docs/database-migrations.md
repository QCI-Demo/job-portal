# Database migrations (Prisma)

This project uses [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) with **PostgreSQL**, alongside the **canonical hand-written SQL** under `db/migrations/`. The first Prisma migration file is a verbatim copy of `db/migrations/000001_initial_job_portal_schema.up.sql` so the database shape stays single-sourced. Apply **either** the SQL files (as in `.github/workflows/validate-db-schema.yml`) **or** `prisma migrate deploy` to a given database, not both.

Migrations are versioned SQL files under `prisma/migrations/`. Prisma records applied migrations in the `_prisma_migrations` table, so **`prisma migrate deploy` is safe to run repeatedly**: already-applied migrations are skipped.

## Prerequisites

- Node.js 18.18 or newer
- PostgreSQL 16 (recommended; 13+ supported for `gen_random_uuid()`)

## One-time setup

1. Copy environment templates and adjust hosts or credentials as needed:

   ```bash
   cp .env.example .env
   ```

   For local development with Docker Compose:

   ```bash
   docker compose up -d postgres
   ```

   Set `DATABASE_URL` in `.env` to match `docker-compose.yml` (default uses host port **5433**: `postgresql://jobportal:jobportal@localhost:5433/jobportal?schema=public`).

2. Install dependencies and generate the Prisma Client:

   ```bash
   npm install
   npm run prisma:generate
   ```

## Applying migrations

| Environment | Command |
|-------------|---------|
| Local (creates migration history interactively) | `npm run migrate:dev` |
| CI / staging / production (non-interactive) | `npm run migrate:deploy` |

After deploy, seed development/test data:

```bash
npm run db:seed
npm run db:seed:validate
```

See **[database-seeding.md](database-seeding.md)** for the full seed workflow, test accounts, and reset instructions.

### Test database

Use a separate database on the same PostgreSQL instance (create with `createdb`) or a dedicated CI service URL. If you use `.env.test` with `DATABASE_URL_TEST`, run:

```bash
npm run test:migrate
```

`test:migrate` runs `prisma migrate deploy` with `.env.test` via `dotenv-cli`.

## Creating a new incremental migration

1. Edit `prisma/schema.prisma` (add or change models and fields).
2. Create a migration:

   ```bash
   npm run migrate:dev -- --name describe_your_change
   ```

   This updates the database, writes a new folder under `prisma/migrations/`, and refreshes the client.

## Rollback

Prisma Migrate does **not** auto-generate “down” SQL. Recommended approaches:

- **Forward fix:** add a new migration that reverses the change (preferred in teams).
- **Reset dev only:** `npx prisma migrate reset` (drops schema, reapplies all migrations, runs seed).
- **Manual SQL:** run targeted `ALTER` / `DROP` against a backup or maintenance window, then align `_prisma_migrations` using `prisma migrate resolve` (advanced; coordinate with the team).

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `P1001: Can't reach database server` | `DATABASE_URL` host/port, firewall, and whether Postgres is running (`docker compose ps`). |
| `Migration failed to apply` | Read the SQL error; fix the migration file or schema, restore from backup if partial apply occurred, then use `prisma migrate resolve` only under a documented recovery process. |
| Drift between DB and `schema.prisma` | Run `npx prisma migrate diff` (from database to schema) to inspect differences; avoid `db push` in production unless that is your agreed workflow. |
| `Environment variable not found: DATABASE_URL` | Ensure `.env` exists in the project root or export `DATABASE_URL` in CI. |
| UUID defaults | PostgreSQL 13+ provides `gen_random_uuid()` without extra extensions. |

## Schema overview

See `db/migrations/000001_initial_job_portal_schema.up.sql` and `docs/job-portal-erd.md` for the full picture. At a glance:

| Table | Purpose |
|-------|---------|
| `users` | Login identity; case-insensitive email uniqueness via `ux_users_email_lower`. |
| `roles` | Canonical roles (`candidate`, `employer`, `admin`) with lowercase `name` checks. |
| `user_roles` | Many-to-many user ↔ role; optional `granted_by` audit. |
| `jobs` | Listings; `employer_user_id` → `users` (RESTRICT on delete). |
| `applications` | One row per candidate per job; `candidate_user_id` → `users` (CASCADE). |

CHECK constraints, comments, and expression indexes are enforced in SQL, not in the Prisma Client layer.
