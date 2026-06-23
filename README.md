# Job Portal

Candidate-facing job portal (MVP Phase 1): public pages, employer listings, and admin tools.

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
| [docs/design/DESIGN-HANDOFF.md](./docs/design/DESIGN-HANDOFF.md) | Tokens, components, accessibility, API mapping for implementation |

Figma deliverables (**Public UI Wireframes** and high-fidelity prototype) should be linked in the design README once created and shared with the Business Analyst.

## Vision

- User-friendly, responsive platform connecting employers and candidates
- WCAG 2.1 AA accessibility, cross-browser support
- Scalable architecture for future phases (resume parsing, paid listings, etc.)

See project overview in story/epic documentation for full scope.
