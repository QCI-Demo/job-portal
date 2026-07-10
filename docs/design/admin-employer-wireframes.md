# Admin & Employer Dashboard Wireframes

This document specifies **high-fidelity wireframe structure** for the Job Portal **Admin** and **Employer** dashboards. Frames target a **1440px desktop** layout with responsive behavior for **tablet (768–1023px)** and **mobile (320–767px)**. Both dashboards share a common **dashboard shell** aligned with the public UI design language.

> **Delivery note:** Figma was skipped per coding-only instructions. The **high-fidelity interactive prototype** lives in `job-portal-frontend/` under `/admin` and `/employer` (index at `/wireframes`). Amber badges and `data-interaction` attributes label each interaction point for stakeholder review.

| Deliverable | Owner | Status | Link |
|-------------|--------|--------|------|
| Low-fidelity structure | Eng | Documented here | This file (ASCII frames + flows) |
| High-fidelity prototype | Eng | Implemented | `job-portal-frontend/` — `/wireframes`, `/admin/*`, `/employer/*` |
| Design hand-off | Eng | Ready | [DASHBOARD-DESIGN-HANDOFF.md](./DASHBOARD-DESIGN-HANDOFF.md) |
| Figma (optional) | Design | Pending | `https://www.figma.com/file/PLACEHOLDER-admin-employer-dashboard-wireframes` |

**Story:** Create Wireframes for Admin and Employer Dashboards  
**Epic:** Admin & Employer Dashboard Development  
**Companion doc:** [Dashboard Design Hand-off](./DASHBOARD-DESIGN-HANDOFF.md)

---

## Shared dashboard shell

```
┌──────────┬───────────────────────────────────────────────────────────┐
│          │ TOP BAR: Brand | Role | View public | User menu | Log out │
│ SIDEBAR  ├───────────────────────────────────────────────────────────┤
│          │                                                           │
│ [Logo]   │  PAGE HEADER: H1 title + primary action button(s)        │
│          │  ─────────────────────────────────────────────────────────  │
│ Nav      │                                                           │
│ items    │  MAIN CONTENT (tables, forms, charts, detail panels)      │
│          │                                                           │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

| Zone | Width (desktop) | Purpose |
|------|-----------------|---------|
| Sidebar | 256px fixed | Primary navigation; drawer on tablet/mobile |
| Top bar | Full remaining width | Brand, role chip, public site link, user menu |
| Content | Fluid | Page-specific tables, forms, widgets |

**Design tokens:** Reuse public UI tokens (`--color-primary`, Source Sans 3 / Fraunces, spacing scale). Dashboard surfaces use `--color-surface` for sidebar and white for content.

---

## Admin Dashboard

**Base route:** `/admin`

### Sidebar navigation

| Nav item | Route | Interaction id |
|----------|-------|----------------|
| Overview | `/admin` | `admin.nav.overview` |
| Users | `/admin/users` | `admin.nav.users` |
| Jobs | `/admin/jobs` | `admin.nav.jobs` |
| Categories | `/admin/categories` | `admin.nav.categories` |
| Settings | `/admin/settings` | `admin.nav.settings` |

### Screens

| Screen | Route | Placeholders | Key interaction labels |
|--------|-------|--------------|------------------------|
| Overview / analytics | `/admin` | KPI cards, line chart, donut chart, activity table | `admin.kpi.*`, `admin.chart.*`, `admin.activity.review.*` |
| User management | `/admin/users` | Filter bar, users table, edit drawer, confirm modal | `admin.users.edit.*`, `admin.users.drawer`, `admin.users.deactivate` |
| Job moderation | `/admin/jobs` | Queue table, detail panel, reject confirm | `admin.jobs.open.*`, `admin.jobs.approve`, `admin.jobs.reject` |
| Category management | `/admin/categories` | Categories table, create/edit form modal | `admin.categories.create`, `admin.categories.form`, `admin.categories.delete.*` |
| Site settings | `/admin/settings` | Tabbed form (General / Email / Moderation) | `admin.settings.tab.*`, `admin.settings.save` |

---

## Employer Dashboard

**Base route:** `/employer`

### Sidebar navigation

| Nav item | Route | Interaction id |
|----------|-------|----------------|
| Overview | `/employer` | `employer.nav.overview` |
| My Jobs | `/employer/jobs` | `employer.nav.jobs` |
| Post a Job | `/employer/jobs/new` | `employer.nav.post` |
| Applications | `/employer/applications` | `employer.nav.applications` |

### Screens

| Screen | Route | Placeholders | Key interaction labels |
|--------|-------|--------------|------------------------|
| Overview | `/employer` | KPI cards, chart, quick actions | `employer.kpi.*`, `employer.overview.postJob` |
| Job list | `/employer/jobs` | Filter bar, jobs table, deactivate confirm | `employer.jobs.edit.*`, `employer.jobs.deactivate.*` |
| Job create | `/employer/jobs/new` | Job creation form | `employer.jobForm`, `employer.jobForm.publish`, `employer.jobForm.saveDraft` |
| Job edit / deactivate | `/employer/jobs/:id/edit` | Edit form + deactivate | `employer.jobForm.deactivate` |
| Application list | `/employer/applications` | Filter bar, applications table | `employer.applications.open.*` |
| Application detail | `/employer/applications/:id` | Profile panel, status form | `employer.applicationDetail.status`, `employer.applicationDetail.save` |

---

## Consistency with admin design language

- Shared `DashboardShell` (sidebar + top bar + content)
- Shared placeholders: `PlaceholderTable`, `PlaceholderChart`, `ConfirmModal`, `StatusBadge`
- Same primary blue (`#1565C0`), surface gray sidebar, Fraunces headings, Source Sans 3 body
- Amber interaction chips on every labeled control for review

---

## How to review

```bash
cd job-portal-frontend
npm install
npm run dev
```

Open `/wireframes` for the screen index, then walk admin and employer flows. No auth is required for wireframe routes so stakeholders can review freely.
