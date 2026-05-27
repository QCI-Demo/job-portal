# Frontend Docker image

Production image for the Job Portal React (Vite) frontend. The image uses a **multi-stage build**: Node.js compiles the app; **nginx** serves the static bundle with SPA routing, compression, and security headers.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+ (BuildKit enabled by default)

## Build

From the repository root:

```bash
docker build -t job-portal-frontend:latest ./job-portal-frontend
```

### Build-time environment variables

Vite embeds `VITE_*` variables during `npm run build`. Pass them with `--build-arg`:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_APP_TITLE="Job Portal" \
  -t job-portal-frontend:latest \
  ./job-portal-frontend
```

| Build arg              | Default                    | Description                          |
| ---------------------- | -------------------------- | ------------------------------------ |
| `VITE_API_BASE_URL`    | `http://localhost:8080`    | Backend API base URL (build-time)    |
| `VITE_APP_TITLE`       | `Job Portal`               | Application title (build-time)       |

## Run

```bash
docker run --rm -p 3000:8080 job-portal-frontend:latest
```

Open [http://localhost:3000](http://localhost:3000).

### Runtime environment variables

At container start, `docker-entrypoint.sh` writes `/env-config.js` so the browser can read configuration **without rebuilding** the image:

```bash
docker run --rm -p 3000:8080 \
  -e VITE_API_BASE_URL=https://api.staging.example.com \
  -e VITE_APP_TITLE="Job Portal (Staging)" \
  job-portal-frontend:latest
```

| Variable             | Default                    | Description                               |
| -------------------- | -------------------------- | ----------------------------------------- |
| `VITE_API_BASE_URL`  | `http://localhost:8080`    | Backend API base URL (runtime, preferred) |
| `VITE_APP_TITLE`     | `Job Portal`               | Application title (runtime)               |

Use `getEnv()` from `src/config/env.ts` in application code to read these values.

### Health check

```bash
curl http://localhost:3000/health
# ok
```

The image defines a Docker `HEALTHCHECK` against the same endpoint.

## Image layout

| Stage      | Base image        | Purpose                                      |
| ---------- | ----------------- | -------------------------------------------- |
| `build`    | `node:22-alpine`  | `npm ci` and `npm run build`                 |
| `production` | `nginx:1.27-alpine` | Serve `dist/` on port **8080** (non-root) |

## Local development (without Docker)

```bash
cd job-portal-frontend
npm install
npm run dev
```

`public/env-config.js` supplies defaults for local dev. Production containers regenerate this file on startup.

## Troubleshooting

- **Blank page after deploy**: Confirm the container maps host port to container port `8080` (not `80`).
- **Stale API URL**: Runtime `-e VITE_*` overrides build args; hard-refresh the browser or disable cache for `env-config.js`.
- **Build failures**: Run `npm run build` locally inside `job-portal-frontend` to reproduce TypeScript or Vite errors before building the image.
