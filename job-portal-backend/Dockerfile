# syntax=docker/dockerfile:1
# Build from repository root:
#   docker build -f job-portal-backend/Dockerfile -t job-portal-backend:latest .

# -----------------------------------------------------------------------------
# Dependencies & Prisma client generation
# -----------------------------------------------------------------------------
FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

COPY job-portal-backend/package.json job-portal-backend/package-lock.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate

COPY job-portal-backend/src ./src

# -----------------------------------------------------------------------------
# Production image — non-root, minimal runtime
# -----------------------------------------------------------------------------
FROM docker.io/library/node:22-alpine AS production

RUN apk add --no-cache wget \
  && addgroup -g 1001 app \
  && adduser -u 1001 -G app -D -H app

WORKDIR /app

ENV NODE_ENV=production

COPY job-portal-backend/package.json job-portal-backend/package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/src ./src

RUN chown -R app:app /app

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
