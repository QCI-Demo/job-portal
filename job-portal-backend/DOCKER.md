# Backend Docker image

Production image for the Job Portal **Express** API. Uses **Node.js 22 Alpine**, generates the **Prisma** client at build time, and runs as a **non-root** user (`app`, UID 1001).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- PostgreSQL with the Job Portal schema applied (see [`job-portal-database/DOCKER.md`](../job-portal-database/DOCKER.md))

## Build

From the **repository root** (required so `prisma/` is in the build context):

```bash
docker build -f job-portal-backend/Dockerfile -t job-portal-backend:latest .
```

## Run

```bash
docker run --rm -p 8080:3000 \
  -e DATABASE_URL="postgresql://jobportal:jobportal@host.docker.internal:5433/jobportal?schema=public" \
  -e CORS_ORIGIN="http://localhost:3000" \
  job-portal-backend:latest
```

### Environment variables

| Variable        | Default   | Description                                      |
| --------------- | --------- | ------------------------------------------------ |
| `PORT`          | `3000`    | HTTP listen port inside the container            |
| `DATABASE_URL`  | *(none)*  | **Required.** PostgreSQL connection string       |
| `CORS_ORIGIN`   | *(open)*  | Comma-separated allowed browser origins          |
| `NODE_ENV`      | `production` | Set automatically in the image              |

### Health check

```bash
curl http://localhost:8080/health
```

Docker `HEALTHCHECK` uses the same endpoint.

## Multi-service stack

Use root [`docker-compose.yml`](../docker-compose.yml) to start database, backend, and frontend together:

```bash
docker compose up --build
```

## Troubleshooting

- **`database unreachable` in `/health`**: Confirm Postgres is running and `DATABASE_URL` uses the Docker network hostname (`database` in Compose, not `localhost`).
- **Prisma errors on startup**: Ensure migrations or init scripts have been applied to the database before starting the API.
- **Build context errors**: Always pass the repository root as context; the Dockerfile copies `prisma/` from the parent directory.
