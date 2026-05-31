# Job Portal

Monorepo for the Job Portal: **React** frontend, **Express** API, and **PostgreSQL** database with normalized schema, migrations, and seed data.

## Services

| Path | Stack | Description |
| ---- | ----- | ----------- |
| [`job-portal-frontend`](./job-portal-frontend) | React, Vite, TypeScript | SPA served by nginx in production |
| [`job-portal-backend`](./job-portal-backend) | Node.js, Express, Prisma | REST API |
| [`job-portal-database`](./job-portal-database) | PostgreSQL 16 | Custom image with schema init scripts |
| [`prisma`](./prisma), [`db`](./db) | Prisma + SQL migrations | Schema and sample data |

## Docker (recommended for integration)

Start database, API, and frontend together:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend health: http://localhost:8080/health  
- Postgres: `localhost:5433` (user/password/db: `jobportal`)

Copy environment defaults and start the stack:

```bash
cp .env.docker.example .env
docker compose up --build
```

See **[docs/docker-compose.md](docs/docker-compose.md)** for orchestration, health checks, persistent storage, cloud overrides, and troubleshooting. Per-image build details: **[docs/DOCKER.md](docs/DOCKER.md)**.

Validate health checks and database persistence:

```bash
./scripts/compose-health-persistence-test.sh
```

### Individual images

```bash
docker build -t job-portal-frontend:latest ./job-portal-frontend
docker build -f job-portal-backend/Dockerfile -t job-portal-backend:latest .
docker build -f job-portal-database/Dockerfile -t job-portal-database:latest .
```

## Frontend development

```bash
cd job-portal-frontend
npm install
npm run dev
```

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Database & Prisma

```bash
cp .env.example .env
docker compose up -d database
npm install && npm run prisma:generate
npm run migrate:deploy
npm run db:seed
```

- **[docs/database-migrations.md](docs/database-migrations.md)** — migrations and `DATABASE_URL`
- **[docs/database-seeding.md](docs/database-seeding.md)** — sample users and jobs
- **[docs/job-portal-erd.md](docs/job-portal-erd.md)** — entity-relationship diagram

## CI

- `.github/workflows/ci.yml` — frontend lint, test, build
- `.github/workflows/validate-db-schema.yml` — SQL migration validation
- `.github/workflows/validate-db-seed.yml` — Prisma seed validation
