# Docker deployment guide

Production-oriented container images for the Job Portal **frontend**, **backend**, and **PostgreSQL** database. Use them individually for CI/CD builds or together via [`docker-compose.yml`](../docker-compose.yml) for local integration.

## Quick start (full stack)

```bash
docker compose up --build
```

| Service  | URL / port                         |
| -------- | ---------------------------------- |
| Frontend | http://localhost:3000              |
| Backend  | http://localhost:8080/health       |
| Postgres | `localhost:5433` (user `jobportal`) |

Configuration reference: [docker-compose.md](./docker-compose.md).

Stop and remove volumes:

```bash
docker compose down -v
```

## Service images

| Service  | Dockerfile path                    | Documentation |
| -------- | ---------------------------------- | ------------- |
| Frontend | `job-portal-frontend/Dockerfile`   | [job-portal-frontend/DOCKER.md](../job-portal-frontend/DOCKER.md) |
| Backend  | `job-portal-backend/Dockerfile`    | [job-portal-backend/DOCKER.md](../job-portal-backend/DOCKER.md) |
| Database | `job-portal-database/Dockerfile`   | [job-portal-database/DOCKER.md](../job-portal-database/DOCKER.md) |

### Build all images

```bash
docker build -t job-portal-frontend:latest ./job-portal-frontend
docker build -f job-portal-backend/Dockerfile -t job-portal-backend:latest .
docker build -f job-portal-database/Dockerfile -t job-portal-database:latest .
```

## Security practices

- **Non-root** processes in frontend (nginx) and backend (Node) images.
- **Multi-stage** frontend build separates compile-time Node toolchain from the minimal nginx runtime.
- **Alpine-based** images to reduce attack surface and image size.
- **Health checks** on every service for orchestrator readiness probes (see [docker-compose.md](./docker-compose.md#health-checks-and-startup-order)).
- **Persistent storage** for PostgreSQL via the `job_portal_pgdata` named volume (see [docker-compose.md](./docker-compose.md#persistent-database-storage)).
- **Secrets** via environment variables at runtime; never bake credentials into images.

## CI/CD notes

- Frontend CI already builds and tests the Vite app (see `.github/workflows/ci.yml`).
- Pipeline jobs can `docker build` each image and push to a registry with immutable tags.
- Run database migrations with `npm run migrate:deploy` in a release job when schema changes ship outside the init SQL path.

## Seed data (optional)

After `docker compose up`, load sample records from the host:

```bash
cp .env.example .env
npm install && npm run prisma:generate
npm run db:seed
```

See [database-seeding.md](./database-seeding.md).
