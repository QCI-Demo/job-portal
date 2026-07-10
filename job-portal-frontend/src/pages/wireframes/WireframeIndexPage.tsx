import { Link } from 'react-router-dom';

const adminScreens = [
  {
    to: '/wireframes/admin',
    label: 'Overview / analytics',
    note: 'KPI cards, charts, activity table',
  },
  { to: '/wireframes/admin/users', label: 'User management', note: 'Filters, table, edit drawer' },
  { to: '/wireframes/admin/jobs', label: 'Job moderation', note: 'Queue table + detail panel' },
  { to: '/wireframes/admin/categories', label: 'Category management', note: 'CRUD form modal' },
  { to: '/wireframes/admin/settings', label: 'Site settings', note: 'Tabbed settings form' },
];

const employerScreens = [
  { to: '/employer', label: 'Overview', note: 'KPIs and quick actions' },
  { to: '/employer/jobs', label: 'Job list', note: 'Edit / deactivate actions' },
  { to: '/employer/jobs/new', label: 'Job creation form', note: 'Publish or save draft' },
  {
    to: '/employer/jobs/ej1/edit',
    label: 'Job edit / deactivate',
    note: 'Edit form with deactivate',
  },
  { to: '/employer/applications', label: 'Application list', note: 'Filter + review links' },
  { to: '/employer/applications/ap1', label: 'Application detail', note: 'Status update panel' },
];

export function WireframeIndexPage() {
  return (
    <div className="min-h-screen bg-surface px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            Design prototype
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">
            Admin & Employer dashboard wireframes
          </h1>
          <p className="max-w-2xl text-ink-muted">
            High-fidelity React wireframes for stakeholder review. Amber labels mark interaction
            points. Figma was skipped per coding-only instructions; this app is the visual
            specification.
          </p>
          <Link to="/" className="btn-secondary inline-flex">
            ← Public site
          </Link>
        </header>

        <section className="rounded-md border border-surface-border bg-white p-5">
          <h2 className="font-display text-2xl font-semibold">Admin dashboard</h2>
          <ul className="mt-4 space-y-3">
            {adminScreens.map((screen) => (
              <li
                key={screen.to}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-surface-border pb-3 last:border-0"
              >
                <div>
                  <Link
                    to={screen.to}
                    className="font-semibold text-primary-700"
                    data-interaction="wireframeIndex.admin"
                  >
                    {screen.label}
                  </Link>
                  <p className="text-sm text-ink-muted">{screen.note}</p>
                </div>
                <code className="text-xs text-ink-muted">{screen.to}</code>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-md border border-surface-border bg-white p-5">
          <h2 className="font-display text-2xl font-semibold">Employer dashboard</h2>
          <ul className="mt-4 space-y-3">
            {employerScreens.map((screen) => (
              <li
                key={screen.to}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-surface-border pb-3 last:border-0"
              >
                <div>
                  <Link
                    to={screen.to}
                    className="font-semibold text-primary-700"
                    data-interaction="wireframeIndex.employer"
                  >
                    {screen.label}
                  </Link>
                  <p className="text-sm text-ink-muted">{screen.note}</p>
                </div>
                <code className="text-xs text-ink-muted">{screen.to}</code>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
