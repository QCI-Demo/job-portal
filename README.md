# Job Portal

Monorepo-style workspace for the Job Portal project.

## Frontend (`job-portal-frontend`)

The React + TypeScript application lives in [`job-portal-frontend`](./job-portal-frontend). It was scaffolded with [Vite](https://vite.dev/) (`react-ts` template).

```bash
cd job-portal-frontend
npm install
npm run dev
```

### Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the Vite dev server            |
| `npm run build`      | Typecheck and production build         |
| `npm run lint`       | Run ESLint                           |
| `npm run format`     | Format with Prettier                 |
| `npm run format:check` | Verify Prettier formatting         |
| `npm test`           | Run Vitest once                      |
| `npm test -- --coverage` | Run tests with coverage report |

Continuous integration runs lint, tests with coverage, and build on every push (see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

### Docker

Build and run the production frontend image (multi-stage Node + nginx):

```bash
docker build -t job-portal-frontend:latest ./job-portal-frontend
docker run --rm -p 3000:8080 job-portal-frontend:latest
```

See [`job-portal-frontend/DOCKER.md`](./job-portal-frontend/DOCKER.md) for build args, runtime environment variables, and troubleshooting.
