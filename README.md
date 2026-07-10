# Job Portal

React-based job portal with public pages, admin/employer dashboard wireframes, and a shared dashboard UI library.

## Packages

| Package                         | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `job-portal-frontend`           | Public pages + interactive dashboard wireframes                  |
| `@jobportal/dashboard-ui`       | Shared React components for admin & employer dashboards          |
| `@jobportal/dashboard-test-app` | Verification app that imports and renders all library components |

## Shared Dashboard UI Library

```bash
# From repo root
npm install
npm run build
npm test
npm run storybook
```

Components: **NavBar**, **DataTable**, **FormInput**, **Button**, **Modal**, **ChartContainer**.

Usage guide: [docs/USAGE.md](docs/USAGE.md)

Publish to the local Verdaccio registry:

```bash
npx verdaccio --config verdaccio-config.yaml
npm publish --workspace=@jobportal/dashboard-ui
```

## Frontend quick start

```bash
cd job-portal-frontend
npm install
npm run dev
```

## Dashboard wireframes (stakeholder review)

| Area         | URL                                                                             |
| ------------ | ------------------------------------------------------------------------------- |
| Screen index | `/wireframes`                                                                   |
| Admin        | `/admin`, `/admin/users`, `/admin/jobs`, `/admin/categories`, `/admin/settings` |
| Employer     | `/employer`, `/employer/jobs`, `/employer/jobs/new`, `/employer/applications`   |

Design docs: `docs/design/admin-employer-wireframes.md`, `docs/design/DASHBOARD-DESIGN-HANDOFF.md`.
