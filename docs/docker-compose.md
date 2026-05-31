# Docker Compose orchestration

Multi-service stack for the Job Portal: **database** (PostgreSQL), **backend** (Express API), and **frontend** (React/nginx). One command starts the full application with health checks, persistent storage, and an isolated bridge network.

## Prerequisites

- Docker Engine 24+ (or compatible Podman with `docker compose`)
- ~2 GB free disk for images and the database volume

## Quick start (local)

```bash
cp .env.docker.example .env
docker compose up --build
```

| Service  | Compose name | URL / access |
| -------- | ------------ | ------------ |
| Frontend | `frontend`   | http://localhost:3000 |
| Backend  | `backend`    | http://localhost:8080/health |
| Database | `database`   | `localhost:5433` (user/db: `jobportal` by default) |

Stop containers and remove the database volume:

```bash
docker compose down -v
```

## Architecture

```mermaid
flowchart LR
  subgraph job_portal_network
    FE[frontend :8080]
    BE[backend :3000]
    DB[(database :5432)]
  end
  User([Browser]) --> FE
  FE -->|VITE_API_BASE_URL| BE
  BE -->|DATABASE_URL| DB
```

All services attach to the **`job_portal_network`** bridge network. The backend resolves the database hostname `database` (compose service name). Host port mappings are configurable via `.env`.

## Build contexts and Dockerfiles

| Service  | Build context | Dockerfile |
| -------- | ------------- | ---------- |
| `database` | Repository root (`.`) | `job-portal-database/Dockerfile` |
| `backend`  | Repository root (`.`) | `job-portal-backend/Dockerfile` |
| `frontend` | `./job-portal-frontend` | `Dockerfile` |

The database image copies SQL migrations from `db/migrations/` on first startup (empty volume). The backend image bundles Prisma client generation from the root `prisma/` directory.

## Environment variables

Copy [`.env.docker.example`](../.env.docker.example) to `.env` at the repository root. Compose substitutes `${VAR}` and `${VAR:-default}` in `docker-compose.yml`.

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `jobportal` | Database credentials |
| `DATABASE_HOST_PORT` | `5433` | Host port mapped to Postgres |
| `DATABASE_URL` | `postgresql://…@database:5432/…` | Backend → database connection |
| `BACKEND_HOST_PORT` | `8080` | Published API port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed browser origin for API |
| `VITE_API_BASE_URL` | `http://localhost:8080` | API URL baked into frontend build |
| `FRONTEND_HOST_PORT` | `3000` | Published SPA port |
| `IMAGE_TAG` | `latest` | Tag for all service images |

Runtime-only frontend variables (`VITE_*` in the running container) are applied via `docker-entrypoint.sh` for `/env-config.js`; the build arg must still match for production builds.

## Cloud / staging deployment

Use the cloud override to avoid publishing the database port on the host:

```bash
export VITE_API_BASE_URL=https://api.your-domain.com
export CORS_ORIGIN=https://app.your-domain.com
docker compose -f docker-compose.yml -f docker-compose.cloud.yml up --build -d
```

In CI/CD, set secrets (`POSTGRES_PASSWORD`, etc.) in the pipeline environment or a managed secret store, then pass them as env vars before `docker compose up`. Push built images to a registry and set `image:` tags instead of `build:` when deploying to Kubernetes or managed containers.

## Health checks and startup order

Compose health checks gate service startup via `depends_on` with `condition: service_healthy`. Startup proceeds in order:

1. **database** — `pg_isready` against container env (`POSTGRES_USER`, `POSTGRES_DB`) until healthy  
2. **backend** — waits for database, then `GET /health` on `PORT` (includes DB ping via Prisma)  
3. **frontend** — waits for backend, then `GET /health` on nginx (`8080` inside the container)

| Service  | Probe | Interval | Start period | Retries |
| -------- | ----- | -------- | ------------ | ------- |
| `database` | `pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"` | 5s | 10s | 10 |
| `backend`  | `wget http://127.0.0.1:$PORT/health` | 15s | 20s | 5 |
| `frontend` | `wget http://127.0.0.1:8080/health` | 15s | 10s | 5 |

Inspect live health status:

```bash
docker compose ps
docker inspect --format='{{.State.Health.Status}}' job-portal-backend
```

If a service stays unhealthy, inspect logs before the health probe exhausts retries:

```bash
docker compose logs database
docker compose logs backend
docker compose logs frontend
```

## Persistent database storage

PostgreSQL data is stored in the named volume **`job_portal_pgdata`**, mounted at `/var/lib/postgresql/data` inside the `database` service. Data survives `docker compose restart` and container recreation; init SQL runs only when the volume is empty.

| Item | Value |
| ---- | ----- |
| Compose volume key | `job_portal_pgdata` |
| Docker volume name | `job_portal_pgdata` |
| Driver | `local` |
| Mount path (container) | `/var/lib/postgresql/data` |

List and inspect the volume:

```bash
docker volume ls --filter name=job_portal_pgdata
docker volume inspect job_portal_pgdata
```

Remove containers **and** delete persisted data:

```bash
docker compose down -v
```

For cloud deployments, back up or replicate this volume (or use a managed database) according to your provider's guidance.

## Verify health checks and persistence

Run the automated integration test after starting Docker:

```bash
cp .env.docker.example .env
./scripts/compose-health-persistence-test.sh
```

This script:

- Brings up the full stack and waits until all health checks pass  
- Inserts a marker row in PostgreSQL  
- Restarts all services and confirms the marker remains  
- Recreates the database container (same volume) and confirms data durability  
- Runs `./scripts/compose-smoke-test.sh` for HTTP/API checks  

For a quick HTTP-only check after manual `docker compose up -d`:

```bash
./scripts/compose-smoke-test.sh
```

```bash
curl -sf http://localhost:8080/health | jq .
curl -sf http://localhost:8080/api/jobs | jq .
curl -sf http://localhost:3000/health
```

## Customization

- **Different host ports** — edit `DATABASE_HOST_PORT`, `BACKEND_HOST_PORT`, or `FRONTEND_HOST_PORT` in `.env`.
- **Rebuild one service** — `docker compose up --build backend`.
- **Logs** — `docker compose logs -f backend`.
- **Shell into database** — `docker compose exec database psql -U jobportal -d jobportal`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------- | --- |
| Backend stays unhealthy | Database not ready or wrong `DATABASE_URL` | `docker compose logs database`; confirm hostname is `database`, not `localhost`, inside containers |
| Health check fails but service responds | Missing `wget` in image or wrong probe port | Rebuild images: `docker compose up --build`; backend probes `$PORT`, frontend probes nginx port `8080` |
| Data missing after restart | Volume removed or wrong volume name | Confirm `job_portal_pgdata` exists: `docker volume inspect job_portal_pgdata`; avoid `docker compose down -v` unless resetting |
| Frontend shows API errors | `VITE_API_BASE_URL` points at wrong host | Rebuild frontend after changing `.env`: `docker compose up --build frontend` |
| `port is already allocated` | Host port in use | Change `*_HOST_PORT` in `.env` |
| Empty job list | Schema initialized but no seed data | Run host seed: `cp .env.example .env && npm install && npm run db:seed` (see [database-seeding.md](./database-seeding.md)) |
| Stale schema after migration changes | Existing volume from old init SQL | `docker compose down -v` then `up --build` (destroys local DB data) |

## Related documentation

- [DOCKER.md](./DOCKER.md) — per-image build and security notes  
- [database-migrations.md](./database-migrations.md) — Prisma migrations  
- [database-seeding.md](./database-seeding.md) — sample data  
