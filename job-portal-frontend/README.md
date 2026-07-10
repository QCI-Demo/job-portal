# Job Portal Frontend

Candidate-facing job portal built with React, TypeScript, Vite, and Tailwind CSS.

This app is the **coded high-fidelity prototype** for the public pages story (Figma skipped per delivery instructions). Layouts, tokens, and flows follow [`docs/design/DESIGN-HANDOFF.md`](../docs/design/DESIGN-HANDOFF.md).

## Pages

| Route | Page | Notes |
|-------|------|--------|
| `/` | Home | Brand hero, keyword search, featured jobs, how-it-works |
| `/jobs` | Job Search | Sidebar filters (drawer on mobile), sort, pagination, URL sync |
| `/jobs/:id` | Job Details | Breadcrumbs, sticky/desktop apply CTA, fixed mobile apply bar |
| `/jobs/:id/apply` | Apply | Auth-gated cover letter + resume upload |
| `/login`, `/register`, `/auth` | Auth | Login/register tabs with validation |
| `/profile` | User Profile | Auth-gated personal info editor |

## Accessibility & responsive

- WCAG 2.1 AA–oriented: skip link, landmarks, labeled fields, focus rings, 44px targets, live regions
- Breakpoints: mobile &lt;768, tablet 768–1023, desktop ≥1024 (sidebar filters / sticky apply)

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Environment:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `/api` or example `http://localhost:8080/api` | Backend base URL |
| `VITE_USE_MOCK_DATA` | `true` (unless set to `false`) | Fall back to sample jobs when API is unreachable |

## Build

```bash
npm run build
npm run preview
```
