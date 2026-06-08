# Job Portal

Candidate-facing job portal with employer listings, admin moderation tools, and role-based dashboards.

## Design documentation

Wireframe specifications and developer hand-off for dashboard UI work:

| Document | Description |
|----------|-------------|
| [docs/design/admin-employer-wireframes.md](./docs/design/admin-employer-wireframes.md) | Admin & employer dashboard wireframes — layouts, screens, interaction labels, Figma checklist |
| [docs/design/DASHBOARD-DESIGN-HANDOFF.md](./docs/design/DASHBOARD-DESIGN-HANDOFF.md) | Tokens, components, routes, API mapping for dashboard implementation |

### Figma deliverables (pending)

High-fidelity wireframes for **Admin** and **Employer** dashboards must be created in Figma and reviewed by stakeholders before development begins. The repository documents the visual specification until design files are linked.

| Deliverable | Scope | Status |
|-------------|--------|--------|
| Admin Dashboard Wireframes | Overview/analytics, user management, job moderation, category management, site settings | Pending — [spec](./docs/design/admin-employer-wireframes.md#admin-dashboard) |
| Employer Dashboard Wireframes | Job posting, editing, deactivation, application review | Pending — [spec](./docs/design/admin-employer-wireframes.md#employer-dashboard) |
| Combined dashboard prototype | Linked flows for both roles | Pending |

Replace placeholder Figma URLs in the design docs once files are shared with the Business Analyst.

## Epic: Admin & Employer Dashboard Development

Secure React-based dashboards for administrators and employers:

- **Admin:** user management, job moderation, category management, site settings, analytics widgets
- **Employer:** job posting, editing, deactivation, application review
- **Both:** role-based access control and backend service integration

Wireframes are specified in documentation first; Figma artifacts and stakeholder sign-off gate implementation.

## Vision

- User-friendly, responsive platform connecting employers and candidates
- WCAG 2.1 AA accessibility, cross-browser support
- Scalable architecture for future phases (resume parsing, paid listings, etc.)
