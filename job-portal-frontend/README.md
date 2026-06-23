# Job Portal Frontend

Candidate-facing job portal built with React, TypeScript, Vite, and Tailwind CSS. Includes protected admin dashboard screens backed by `@jobportal/dashboard-ui`.

## Pages

### Public

- **Home** — Hero, navigation, and featured jobs carousel (`GET /jobs?featured=true` via axios)
- **Job Search** — Filters (keywords, location, category), API integration via `fetch`, client-side pagination (10 per page)
- **Job Details** — Full job information with Apply CTA (`GET /jobs/:id`)

### Admin (requires `admin` role)

Protected routes use `PrivateRoute`, which checks session auth and JWT role claims:

| Route | Screen |
|-------|--------|
| `/users` | User management (CRUD, role editing, deactivation) |
| `/jobs` | Job moderation (admins see management UI; others see public search) |
| `/categories` | Category management |
| `/settings` | Site settings |
| `/analytics` | Analytics widgets (`GET /admin/analytics`) |

Admin APIs: `/admin/users`, `/admin/jobs`, `/admin/categories`, `/admin/settings`, `/admin/analytics`.

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
