# syntax=docker/dockerfile:1
# Build from repository root:
#   docker build -f job-portal-database/Dockerfile -t job-portal-database:latest .

FROM postgres:16-alpine

LABEL org.opencontainers.image.title="Job Portal PostgreSQL"
LABEL org.opencontainers.image.description="PostgreSQL 16 with schema initialization for Job Portal"

# Official image runs *.sql and *.sh in this directory on first startup (empty data volume).
COPY db/migrations/000001_initial_job_portal_schema.up.sql \
  /docker-entrypoint-initdb.d/01-schema.sql
COPY job-portal-database/docker-entrypoint-initdb.d/02-roles.sql \
  /docker-entrypoint-initdb.d/02-roles.sql

# Harden defaults for containerized deployments (override via command if needed).
ENV POSTGRES_INITDB_ARGS="--data-checksums"

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" || exit 1
