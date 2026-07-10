# Job Portal Frontend

Candidate-facing job portal built with React, TypeScript, Vite, and Tailwind CSS.

## Pages

- **Home** — Hero, navigation, and featured jobs carousel (`GET /jobs?featured=true` via axios)
- **Job Search** — Filters (keywords, location, category), API integration via `fetch`, client-side pagination (10 per page)
- **Job Details** — Full job information with Apply CTA (`GET /jobs/:id`)

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to your backend API base (default `/api`, proxied to `http://localhost:8080` in dev).

## Build

```bash
npm run build
npm run preview
```
