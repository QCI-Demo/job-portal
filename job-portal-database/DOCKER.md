# Database Docker image

Custom **PostgreSQL 16** image for the Job Portal, based on the official [`postgres:16-alpine`](https://hub.docker.com/_/postgres) image.

## Features

- **Persistent storage** via a named Docker volume (see `docker-compose.yml`).
- **Initialization scripts** applied automatically on first startup when the data directory is empty:
  - `01-schema.sql` — core tables, constraints, and indexes (`db/migrations/000001_initial_job_portal_schema.up.sql`).
  - `02-roles.sql` — default RBAC roles (`candidate`, `employer`, `admin`).
- **Environment variables** for credentials and database name (standard Postgres image variables).

## Build

From the repository root:

```bash
docker build -f job-portal-database/Dockerfile -t job-portal-database:latest .
```

## Run (standalone)

```bash
docker volume create job_portal_pgdata

docker run --rm -d \
  --name job-portal-postgres \
  -e POSTGRES_USER=jobportal \
  -e POSTGRES_PASSWORD=jobportal \
  -e POSTGRES_DB=jobportal \
  -p 5433:5432 \
  -v job_portal_pgdata:/var/lib/postgresql/data \
  job-portal-database:latest
```

### Environment variables

| Variable              | Example     | Description                          |
| --------------------- | ----------- | ------------------------------------ |
| `POSTGRES_USER`       | `jobportal` | Database superuser / app user        |
| `POSTGRES_PASSWORD`   | *(secret)*  | Password for `POSTGRES_USER`         |
| `POSTGRES_DB`         | `jobportal` | Default database created on init     |

Use strong passwords in production and inject secrets via your orchestrator (Kubernetes secrets, AWS Secrets Manager, etc.).

### Connectivity test

```bash
docker exec job-portal-postgres pg_isready -U jobportal -d jobportal
psql "postgresql://jobportal:jobportal@localhost:5433/jobportal" -c '\dt'
```

You should see `users`, `roles`, `jobs`, `applications`, and related tables.

## Persistent volumes

Init scripts run **only once** when `/var/lib/postgresql/data` is empty. To reset:

```bash
docker compose down -v   # removes named volume in Compose
```

## Prisma migrations vs. init scripts

This image applies the canonical SQL migration on first boot. For ongoing schema changes in development, prefer `npm run migrate:deploy` against a running instance (see [`docs/database-migrations.md`](../docs/database-migrations.md)). Do not apply both the SQL init script and Prisma migrations to the same **fresh** database twice.

## Sample data

After the container is healthy, load development seed data from the host:

```bash
cp .env.example .env
# Set DATABASE_URL to match the container (port 5433 when published)
npm install && npm run prisma:generate
npm run db:seed
```

See [`docs/database-seeding.md`](../docs/database-seeding.md).
