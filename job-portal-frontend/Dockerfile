# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Build stage — compile the Vite/React app
# -----------------------------------------------------------------------------
FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

# Install dependencies (cached when package files are unchanged)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at build time.
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_APP_TITLE=Job Portal
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}

RUN npm run build

# -----------------------------------------------------------------------------
# Production stage — serve static assets with nginx (non-root, port 8080)
# -----------------------------------------------------------------------------
FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine AS production

USER 0
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

COPY --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
