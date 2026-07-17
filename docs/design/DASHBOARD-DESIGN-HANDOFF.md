# Design Hand-off – Admin & Employer Dashboards

**Story:** Create Wireframes for Admin and Employer Dashboards  
**Epic:** Admin & Employer Dashboard Development  
**Audience:** Frontend engineers (React + TypeScript) and stakeholders  
**Companion doc:** [Admin & Employer Wireframes](./admin-employer-wireframes.md)

---

## 1. Source of truth (coded prototype)

Figma was skipped for this delivery; the React wireframe screens under `job-portal-frontend/` are the interactive high-fidelity specification.

| Asset | Location | Notes |
|-------|----------|--------|
| Low-fidelity structure | [admin-employer-wireframes.md](./admin-employer-wireframes.md) | ASCII layouts + interaction map |
| High-fidelity prototype | `job-portal-frontend/src/pages/wireframes/` | Admin + employer screens with mock data |
| Shared shell / placeholders | `job-portal-frontend/src/components/wireframe/` | Tables, charts, forms, labels |
| Design tokens | CSS variables in `src/index.css` + Tailwind theme | Match public UI |

**Shareable preview:** run `npm run dev` in `job-portal-frontend/` and open `/wireframes`.

**Legacy Figma placeholders (optional future sync):**

- Wireframes file: `https://www.figma.com/file/PLACEHOLDER-admin-employer-dashboard-wireframes`
- Dashboard prototype: `https://www.figma.com/proto/PLACEHOLDER-dashboard-prototype`

---

## 2. Design language consistency

Dashboards extend the public Job Portal design system.

### Shared tokens

| Token | Value | Dashboard usage |
|-------|-------|-----------------|
| `--color-primary` | `#1565C0` | Primary buttons, active nav indicator |
| `--color-surface` | `#F5F5F5` | Sidebar background |
| `--color-background` | `#FFFFFF` | Main content area |
| `--color-border` | `#E0E0E0` | Table dividers, panel borders |
| `--color-error` | `#C62828` | Destructive actions |
| `--color-success` | `#2E7D32` | Success / published badges |
| Display font | Fraunces | Page titles |
| UI font | Source Sans 3 | Body / controls |
| `--sidebar-width` | `256px` | Expanded sidebar |
| `--topbar-height` | `56px` | Dashboard header bar |

### Wireframe components (implementation mapping)

| Component | File | Implementation note |
|-----------|------|---------------------|
| `DashboardShell` | `components/wireframe/DashboardShell.tsx` | Become role-aware layout with auth |
| `PlaceholderTable` | `components/wireframe/PlaceholderTable.tsx` | Replace with real `DataTable` + API |
| `PlaceholderChart` | `components/wireframe/PlaceholderChart.tsx` | Swap for chart library |
| `ConfirmModal` | `components/wireframe/ConfirmModal.tsx` | Keep pattern; wire to mutations |
| `StatusBadge` | `components/wireframe/StatusBadge.tsx` | Map to domain enums |
| `InteractionLabel` / amber chips | throughout | Remove after stakeholder sign-off |

---

## 3. Route map

### Admin routes (wireframe — no auth gate)

| Screen | Route | Key actions |
|--------|-------|-------------|
| Overview | `/admin` | View KPIs and charts |
| Users | `/admin/users` | List, filter, edit roles |
| Jobs | `/admin/jobs` | Moderation queue + detail |
| Categories | `/admin/categories` | CRUD categories |
| Settings | `/admin/settings` | Site configuration tabs |

### Employer routes (wireframe — no auth gate)

| Screen | Route | Key actions |
|--------|-------|-------------|
| Overview | `/employer` | Summary + quick CTA |
| My jobs | `/employer/jobs` | List, filter, row actions |
| Post job | `/employer/jobs/new` | Create draft or publish |
| Edit job | `/employer/jobs/:id/edit` | Update, deactivate |
| Applications | `/employer/applications` | List by job/status |
| Application detail | `/employer/applications/:id` | Review, update status |

**Post-sign-off:** Add role guards (`admin` / `employer`), redirect unauthenticated users to `/login`, and return 403 for wrong role.

---

## 4. Interaction labeling convention

Every control intended for review uses:

1. Visible amber chip with the interaction id (wireframe only)
2. `data-interaction="<id>"` attribute for QA / annotation tooling

Examples: `admin.users.edit.u1`, `employer.jobForm.deactivate`, `admin.chart.applications`.

Remove amber chips when moving from wireframe prototype to production screens.

---

## 5. Acceptance checklist (stakeholder review)

- [ ] Admin navigation covers overview, users, jobs, categories, settings
- [ ] Admin tables / forms / charts are present with labeled interactions
- [ ] Employer job create, edit, deactivate, and application review screens are present
- [ ] Visual language matches public site (primary blue, fonts, spacing)
- [ ] Mobile: sidebar collapses to drawer; tables scroll horizontally
- [ ] Sign-off recorded before production dashboard implementation begins
