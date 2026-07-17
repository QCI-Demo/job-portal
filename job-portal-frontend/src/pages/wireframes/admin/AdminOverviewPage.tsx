import { Link } from 'react-router-dom';
import { PlaceholderChart } from '../../../components/wireframe/PlaceholderChart';
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable';
import { adminActivity, adminKpis } from '../../../data/wireframeMock';

export function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Admin · Overview
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">Dashboard overview</h1>
          <p className="mt-1 text-ink-muted">Analytics widgets and moderation queue preview.</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="KPI cards">
        {adminKpis.map((kpi) => (
          <Link
            key={kpi.id}
            to={kpi.href}
            className="rounded-md border border-surface-border bg-white p-4 shadow-sm transition hover:border-primary-500 hover:shadow-elevate"
            data-interaction={`admin.kpi.${kpi.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-ink-muted">{kpi.label}</p>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
                admin.kpi.{kpi.id}
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{kpi.value}</p>
            <p className="mt-1 text-xs font-semibold text-primary-700">{kpi.delta}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PlaceholderChart
          title="Applications over time"
          variant="line"
          interactionId="admin.chart.applications"
        />
        <PlaceholderChart
          title="Jobs by status"
          variant="donut"
          interactionId="admin.chart.jobStatus"
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">Recent activity</h2>
          <Link
            to="/wireframes/admin/jobs"
            className="text-sm font-semibold text-primary-700"
            data-interaction="admin.activity.viewAll"
          >
            View moderation queue →
          </Link>
        </div>
        <PlaceholderTable
          caption="Recent moderation activity"
          interactionId="admin.activity.table"
          rows={adminActivity}
          columns={[
            { key: 'type', header: 'Type', render: (row) => row.type },
            { key: 'subject', header: 'Subject', render: (row) => row.subject },
            { key: 'submitted', header: 'Submitted', render: (row) => row.submitted },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <Link
                  to={row.type === 'Job' ? '/wireframes/admin/jobs' : '/wireframes/admin/users'}
                  className="font-semibold text-primary-700"
                  data-interaction={`admin.activity.review.${row.id}`}
                >
                  Review →
                </Link>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
