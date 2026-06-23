# Job Portal

Candidate-facing job portal with employer listings, admin moderation tools, and role-based dashboards.

## Frontend

The public candidate UI lives in [`job-portal-frontend/`](job-portal-frontend/). See that directory's README for setup and development instructions.

## Shared Dashboard Component Library

Monorepo containing `@jobportal/dashboard-ui`, a reusable React component library for admin and employer dashboards.

| Package                         | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `@jobportal/dashboard-ui`       | Core UI components (NavBar, DataTable, FormInput, Button, Modal, ChartContainer) |
| `@jobportal/dashboard-test-app` | Verification app that imports and renders all components                         |

```bash
npm install
npm run build
npm test
npm run storybook
```

See [docs/USAGE.md](docs/USAGE.md) for installation, component API reference, and publishing instructions.

## Design documentation

Wireframe specifications and developer hand-off:

| Document | Description |
|----------|-------------|
| [docs/design/README.md](./docs/design/README.md) | Low-fidelity wireframes, page layouts, navigation flows, responsive notes |
| [docs/design/DESIGN-HANDOFF.md](./docs/design/DESIGN-HANDOFF.md) | Tokens, components, accessibility, API mapping for public pages |
| [docs/design/admin-employer-wireframes.md](./docs/design/admin-employer-wireframes.md) | Admin & employer dashboard wireframes |
| [docs/design/DASHBOARD-DESIGN-HANDOFF.md](./docs/design/DASHBOARD-DESIGN-HANDOFF.md) | Tokens, components, routes, API mapping for dashboard implementation |

## Epic: Admin & Employer Dashboard Development

Secure React-based dashboards for administrators and employers:

- **Admin:** user management, job moderation, category management, site settings, analytics widgets
- **Employer:** job posting, editing, deactivation, application review
- **Both:** role-based access control and backend service integration

## Vision

- User-friendly, responsive platform connecting employers and candidates
- WCAG 2.1 AA accessibility, cross-browser support
- Scalable architecture for future phases (resume parsing, paid listings, etc.)

See project overview in story/epic documentation for full scope.
