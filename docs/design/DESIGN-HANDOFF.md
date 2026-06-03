# Design Hand-off – Public Job Portal UI

**Story:** Create Wireframes and High-Fidelity Prototypes for Public Pages  
**Epic:** Public Job Portal UI Development  
**Audience:** Frontend engineers (React + TypeScript)  
**Companion doc:** [Wireframes README](./README.md)

---

## 1. Figma source of truth

| Asset | Figma project | Frame width | Notes |
|-------|---------------|-------------|--------|
| Low-fidelity | Public UI Wireframes | 1440px desktop | Grayscale placeholders; linked flows |
| High-fidelity | Public UI – High Fidelity (duplicate of wireframes) | 1440, 768, 375 | Brand styles, components, prototype |

**Links (update when available):**

- Wireframes file: `https://www.figma.com/file/PLACEHOLDER-public-ui-wireframes`
- Hi-fi prototype: `https://www.figma.com/proto/PLACEHOLDER-public-ui-hifi`

Export specs via Figma **Inspect** (spacing, colors, typography). Prefer **design tokens** below for implementation consistency.

---

## 2. Brand & design tokens

Default tokens for MVP until a formal brand guide is published. Map these to CSS variables or a theme object (e.g. Tailwind / CSS modules).

### Color (WCAG 2.1 AA–oriented)

| Token | Hex | Usage | Contrast on white |
|-------|-----|--------|-------------------|
| `--color-primary` | `#1565C0` | Primary buttons, links, focus ring | 4.6:1 ✓ |
| `--color-primary-hover` | `#0D47A1` | Button hover | 7.0:1 ✓ |
| `--color-secondary` | `#455A64` | Secondary text, labels | 7.0:1 ✓ |
| `--color-text` | `#212121` | Body text | 16.1:1 ✓ |
| `--color-text-muted` | `#616161` | Meta, captions | 5.7:1 ✓ |
| `--color-background` | `#FFFFFF` | Page background | — |
| `--color-surface` | `#F5F5F5` | Cards, input backgrounds | — |
| `--color-border` | `#E0E0E0` | Dividers, input borders | — |
| `--color-error` | `#C62828` | Errors, destructive | 5.9:1 on white ✓ |
| `--color-success` | `#2E7D32` | Success messages | 4.5:1 ✓ |
| `--color-footer-bg` | `#263238` | Footer background | — |
| `--color-footer-text` | `#ECEFF1` | Footer links | 12.6:1 on footer ✓ |

Do not rely on color alone for status (pair with icon + text).

### Typography

| Token | Font | Size / line-height | Weight | Usage |
|-------|------|-------------------|--------|--------|
| `--font-family` | `Inter, system-ui, sans-serif` | — | — | All UI |
| `--text-h1` | Inter | 32px / 40px | 700 | Page titles |
| `--text-h2` | Inter | 24px / 32px | 600 | Section titles |
| `--text-h3` | Inter | 20px / 28px | 600 | Card titles |
| `--text-body` | Inter | 16px / 24px | 400 | Body |
| `--text-small` | Inter | 14px / 20px | 400 | Meta, labels |
| `--text-button` | Inter | 16px / 24px | 600 | Buttons |

### Spacing & layout

| Token | Value |
|-------|--------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--container-max` | 1200px |
| `--header-height` | 64px |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.12)` |

### Breakpoints (implement in CSS/JS)

```css
/* Mobile first */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

| Name | Min width | Max width |
|------|-----------|-----------|
| `sm` | 320px | 767px |
| `md` | 768px | 1023px |
| `lg` | 1024px | — |

---

## 3. Page → route mapping

| Page | Route | Auth |
|------|-------|------|
| Home | `/` | Public |
| Job Search | `/jobs` | Public |
| Job Details | `/jobs/:jobId` | Public |
| Apply | `/jobs/:jobId/apply` | Required (redirect guests) |
| Registration/Login | `/auth`, `/login`, `/register` | Public |
| User Profile | `/profile` | Required |

Query params: `returnUrl` on auth and apply redirects; search uses `q`, `location`, `category`, `type`, `page`.

---

## 4. Component inventory

Build as reusable React components. Names align with Figma component sets.

### Global

| Component | Props / behavior | A11y |
|-----------|------------------|------|
| `AppHeader` | `user?: User`, nav links, mobile menu | `nav` landmark; skip link to main |
| `AppFooter` | Link groups | Footer `contentinfo` |
| `SkipToContent` | — | First focusable element |
| `Button` | `variant`: primary \| secondary \| ghost; `loading` | `aria-busy` when loading; min 44×44px touch target |
| `TextInput` | `label`, `error`, `required` | Associated `<label>`; `aria-invalid`, `aria-describedby` |
| `Select` | Options, label | Native `<select>` or accessible combobox pattern |
| `Card` | Job summary variant | Heading level appropriate to context |

### Home

| Component | Notes |
|-----------|--------|
| `HeroSearch` | Keyword input + submit → `/jobs?q=` |
| `FeaturedJobGrid` | Fetch featured jobs API; skeleton while loading |
| `HowItWorks` | Static content; icons decorative with `aria-hidden` |

### Job Search

| Component | Notes |
|-----------|--------|
| `JobFilters` | Sidebar desktop; `Drawer` mobile; debounce filter apply |
| `JobSort` | Dropdown: newest, relevance |
| `JobList` | List or cards; empty state |
| `Pagination` | `aria-current="page"` on active page |

### Job Details

| Component | Notes |
|-----------|--------|
| `JobHeader` | Title, company, meta |
| `JobDescription` | HTML from API – sanitize |
| `ApplyCTA` | Sticky desktop / fixed mobile bottom |
| `Breadcrumb` | `nav` with `aria-label="Breadcrumb"` |

### Apply

| Component | Notes |
|-----------|--------|
| `ApplicationForm` | Controlled form; Zod or similar validation |
| `FileUpload` | Resume; show file name, errors, progress |
| `ApplySuccess` | Confirmation route or modal |

### Auth

| Component | Notes |
|-----------|--------|
| `AuthTabs` | Login / Register; keyboard roving tabindex |
| `LoginForm` / `RegisterForm` | Server errors in `role="alert"` region |

### Profile

| Component | Notes |
|-----------|--------|
| `ProfileNav` | Tabs or side nav |
| `PersonalInfoForm` | PATCH profile API |
| `ResumeSection` | Upload/replace |
| `ApplicationsList` | Link to job detail |

---

## 5. Interaction specifications

| Interaction | Desktop | Mobile |
|-------------|---------|--------|
| Primary nav | Horizontal links | Hamburger → focus trap in menu |
| Job filters | Persistent sidebar | “Filters” opens drawer; Apply closes drawer |
| Sort jobs | Dropdown below results header | Same |
| Apply on Job Details | Sticky right column | Fixed bottom bar; safe-area padding |
| Auth tabs | Click / keyboard | Same |
| Form validation | Inline on blur; summary on submit | Same |
| Loading | Skeleton cards / button spinner | Same |

**Hover:** Primary button → `--color-primary-hover`; cards → subtle shadow + underline on title link.  
**Focus:** 2px solid `--color-primary` outline, offset 2px (never remove outline without replacement).  
**Disabled:** 50% opacity + `pointer-events: none` + `aria-disabled="true"`.

---

## 6. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Perceivable | Text alternatives for icons; don’t convey info by color alone |
| Operable | All actions keyboard reachable; no keyboard traps except modals/drawers with escape |
| Understandable | Consistent nav; clear error messages; language `lang="en"` on `<html>` |
| Robust | Semantic HTML; valid ARIA only where needed |

**Checklist per page:**

- [ ] One `<h1>` per page  
- [ ] Logical heading order  
- [ ] Form labels visible (not placeholder-only)  
- [ ] Focus order matches visual order  
- [ ] Modal/drawer: focus trap, `Escape` closes, return focus to trigger  
- [ ] Live regions for async errors (`role="alert"`)  
- [ ] Target size ≥ 44×44px for primary controls  

Test with axe DevTools and keyboard-only pass before release.

---

## 7. API integration (expected contracts)

Align with backend when OpenAPI is available. Illustrative shapes:

```typescript
// GET /api/jobs?query&location&category&type&page&pageSize
interface JobListItem {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  postedAt: string;
  snippet?: string;
}

// GET /api/jobs/:id
interface JobDetail extends JobListItem {
  descriptionHtml: string;
  requirements?: string[];
  benefits?: string[];
}

// POST /api/jobs/:id/applications (multipart)
interface ApplicationPayload {
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  resume: File;
}

// POST /api/auth/login | /api/auth/register
// GET/PATCH /api/users/me
```

**Performance (epic NFR):** LCP target &lt; 2s on typical mobile – lazy-load below-fold images, paginate job list, code-split routes.

---

## 8. Assets & export

| Asset | Format | Naming |
|-------|--------|--------|
| Logo | SVG | `logo.svg` |
| Icons | SVG sprite or React icons | `icon-*.svg` |
| OG image | PNG 1200×630 | `og-default.png` |

Figma export: 1x and 2x for raster; prefer SVG for icons.

---

## 9. States to implement (not always in wireframes)

| State | Where |
|-------|--------|
| Loading | Lists, job detail, form submit |
| Empty | No search results, no applications |
| Error | Network failure, 404 job, validation |
| Unauthorized | Redirect to `/auth?returnUrl=...` |
| Success | Apply submitted, profile saved |

---

## 10. Definition of done (design → dev)

- [ ] Figma low-fi and hi-fi links added to [README](./README.md)  
- [ ] BA signed off on navigation flow diagram  
- [ ] Tokens implemented in theme/CSS variables  
- [ ] Six routes match wireframe structure  
- [ ] Responsive verified at 375, 768, 1440  
- [ ] axe scan: no critical violations on public pages  
- [ ] Prototype flows match § navigation in wireframes README  

---

## 11. Contacts & changelog

| Role | Responsibility |
|------|----------------|
| Business Analyst | Flow approval, copy |
| Design | Figma files, token updates |
| Frontend | React implementation |
| Backend | API contracts |

| Date | Change |
|------|--------|
| 2026-06-03 | Initial hand-off from wireframe specification (docs substitute for Figma delivery in repo) |
