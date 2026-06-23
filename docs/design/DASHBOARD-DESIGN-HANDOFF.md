# Design Hand-off – Admin & Employer Dashboards

**Story:** Create Wireframes for Admin and Employer Dashboards  
**Epic:** Admin & Employer Dashboard Development  
**Audience:** Frontend engineers (React + TypeScript)  
**Companion doc:** [Admin & Employer Wireframes](./admin-employer-wireframes.md)

---

## 1. Figma source of truth

| Asset | Figma project | Frame width | Notes |
|-------|---------------|-------------|--------|
| Admin wireframes | Admin & Employer Dashboards | 1440px desktop | Tables, forms, chart placeholders; labeled interactions |
| Employer wireframes | Same file | 1440px desktop | Shared shell components with admin |
| Combined prototype | Same file | 1440, 768, 375 | Linked flows per navigation tables in wireframes doc |

**Links (update when available):**

- Wireframes file: `https://www.figma.com/file/PLACEHOLDER-admin-employer-dashboard-wireframes`
- Dashboard prototype: `https://www.figma.com/proto/PLACEHOLDER-dashboard-prototype`

> **Note:** Figma files are created by the design team. This repository documents the specification until Figma links are published and reviewed by stakeholders.

---

## 2. Design language consistency

Dashboards extend the public Job Portal design system. Reuse tokens from the public UI hand-off where applicable.

### Shared tokens

| Token | Value | Dashboard usage |
|-------|-------|-----------------|
| `--color-primary` | `#1565C0` | Primary buttons, active nav indicator |
| `--color-surface` | `#F5F5F5` | Sidebar background |
| `--color-background` | `#FFFFFF` | Main content area |
| `--color-border` | `#E0E0E0` | Table dividers, card borders |
| `--color-error` | `#C62828` | Destructive actions (deactivate, reject, delete) |
| `--color-success` | `#2E7D32` | Success toasts, published badge |
| `--font-family` | `Inter, system-ui, sans-serif` | All dashboard UI |
| `--sidebar-width` | `256px` | Expanded sidebar |
| `--topbar-height` | `56px` | Dashboard header bar |

### Dashboard-specific components

| Component | Variants | Notes |
|-----------|----------|--------|
| `DashboardShell` | `role: admin \| employer` | Sidebar + top bar + outlet |
| `SidebarNav` | Active item state | `aria-current="page"` on active link |
| `DataTable` | Sortable columns, row actions, pagination | Responsive card fallback on mobile |
| `FilterBar` | Search, selects, date range | Debounced search |
| `KpiCard` | Metric + optional sparkline | Admin/employer overview |
| `ChartPlaceholder` | Line, bar, donut | Swap for chart library in implementation |
| `FormSection` | Titled groups with actions | Job forms, settings |
| `ConfirmModal` | Default, destructive | Deactivate job, delete category, reject application |
| `StatusBadge` | Per enum value | Job and application statuses |
| `DrawerPanel` | Right-side | User edit (admin) |
| `EmptyState` | Icon + message + CTA | Zero rows in tables |

---

## 3. Route map

### Admin routes (`admin` role required)

| Screen | Route | Key actions |
|--------|-------|-------------|
| Overview | `/admin` | View KPIs and charts |
| Users | `/admin/users` | List, filter, edit roles |
| User edit | `/admin/users/:id` (drawer) | Update roles, suspend |
| Jobs | `/admin/jobs` | Moderation queue |
| Job detail | `/admin/jobs/:id` | Approve, reject, notes |
| Categories | `/admin/categories` | CRUD categories |
| Settings | `/admin/settings` | Site configuration tabs |

### Employer routes (`employer` role required)

| Screen | Route | Key actions |
|--------|-------|-------------|
| Overview | `/employer` | Summary + quick CTA |
| My jobs | `/employer/jobs` | List, filter, row actions |
| Post job | `/employer/jobs/new` | Create draft or publish |
| Edit job | `/employer/jobs/:id/edit` | Update, deactivate |
| Applications | `/employer/applications` | List by job/status |
| Application detail | `/employer/applications/:id` | Review, update status |

**Guards:** Redirect unauthenticated users to `/auth?returnUrl=…`. Return 403 page for wrong role.

---

## 4. Data model alignment

Fields map to the Prisma schema (`users`, `roles`, `user_roles`, `jobs`, `applications`). Categories and site settings are specified for wireframes; add migrations before implementation if not yet in schema.

### Job status (`JobStatus`)

| Value | UI label | Employer actions | Admin actions |
|-------|----------|------------------|---------------|
| `DRAFT` | Draft | Edit, publish, delete | Review |
| `PUBLISHED` | Published | Edit, deactivate | Moderate, flag |
| `CLOSED` | Closed | View, reopen (optional) | Archive |
| `ARCHIVED` | Archived | View only | — |

### Application status (`ApplicationStatus`)

| Value | UI label | Employer actions |
|-------|----------|------------------|
| `SUBMITTED` | Submitted | Mark under review, reject |
| `UNDER_REVIEW` | Under review | Shortlist, reject |
| `SHORTLISTED` | Shortlisted | Offer, reject |
| `OFFERED` | Offered | — |
| `REJECTED` | Rejected | — |
| `WITHDRAWN` | Withdrawn | — |

---

## 5. API mapping (implementation reference)

Endpoints are illustrative; align with backend OpenAPI when available.

| Screen | Method | Endpoint | Body / params |
|--------|--------|----------|---------------|
| Admin KPIs | GET | `/api/admin/analytics/summary` | — |
| Admin users | GET | `/api/admin/users` | `?q&role&status&page` |
| Update user | PATCH | `/api/admin/users/:id` | `{ roles, status }` |
| Admin jobs | GET | `/api/admin/jobs` | `?status&employer&page` |
| Moderate job | POST | `/api/admin/jobs/:id/moderate` | `{ action, notes }` |
| Categories | GET/POST/PATCH/DELETE | `/api/admin/categories` | CRUD payloads |
| Site settings | GET/PATCH | `/api/admin/settings` | Tab-specific JSON |
| Employer jobs | GET | `/api/employer/jobs` | `?status&sort&page` |
| Create job | POST | `/api/employer/jobs` | Job form fields |
| Update job | PATCH | `/api/employer/jobs/:id` | Partial job fields |
| Deactivate job | POST | `/api/employer/jobs/:id/deactivate` | `{ reason? }` |
| Applications | GET | `/api/employer/applications` | `?jobId&status&page` |
| Application detail | GET | `/api/employer/applications/:id` | — |
| Update application | PATCH | `/api/employer/applications/:id` | `{ status, notes }` |

---

## 6. Component implementation notes

### DataTable

- Server-side pagination and sorting for admin users/jobs lists.
- Row actions: icon button + `···` menu with `aria-label` per action.
- Selectable rows (optional) for bulk actions in admin jobs/users (future).

### Job form

- Rich text editor for description (sanitize HTML on render).
- Category select populated from `/api/categories` (active only).
- Salary fields: numeric validation; optional min ≤ max.
- Dirty form guard on **Cancel** and sidebar navigation.

### Charts (admin overview)

- Recommended libraries: Recharts, Chart.js, or similar.
- Provide skeleton loaders matching KPI card layout.
- Ensure chart colors meet contrast requirements; supplement with labels.

### Modals and drawers

- Focus trap while open; `Escape` closes.
- Return focus to triggering control on close.
- Destructive confirm: require explicit click on labeled destructive button (no auto-focus on destructive).

---

## 7. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Landmarks | `nav` for sidebar; `main` for content; `banner` for top bar |
| Tables | `<th scope="col">`; caption or `aria-label` on table |
| Sort | Announce sort direction via `aria-sort` |
| Status badges | Text label always visible; icons `aria-hidden` |
| Forms | All inputs labeled; errors in `role="alert"` region |
| Keyboard | Full operability for nav, tables, modals, drawers |

---

## 8. Responsive summary

| Pattern | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Fixed | Overlay drawer via hamburger |
| Tables | Full columns | Stacked cards; primary actions visible |
| Job form | Single column max 720px | Full width |
| Application detail | Two columns | Stacked; actions sticky bottom optional |
| Charts | 2-column grid | Single column stack |

---

## 9. Task completion status

| Task ID | Description | Repo status | Figma status |
|---------|-------------|-------------|--------------|
| `dfc9861f-7adf-406c-8cd5-5ffd92ae5751` | Design Admin Dashboard Wireframes | Spec in [admin-employer-wireframes.md](./admin-employer-wireframes.md) | Pending design team |
| `4e2bfb87-21fa-4d66-b5b2-8baa46138088` | Design Employer Dashboard Wireframes | Spec in [admin-employer-wireframes.md](./admin-employer-wireframes.md) | Pending design team |

---

## Related documentation

- [Admin & Employer Wireframes](./admin-employer-wireframes.md)
- [Project overview](../../README.md)
