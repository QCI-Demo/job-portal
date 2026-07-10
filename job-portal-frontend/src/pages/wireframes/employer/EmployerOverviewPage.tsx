import { Link } from 'react-router-dom'
import { PlaceholderChart } from '../../../components/wireframe/PlaceholderChart'
import { employerKpis } from '../../../data/wireframeMock'

export function EmployerOverviewPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Employer · Overview</p>
          <h1 className="font-display text-3xl font-bold text-ink">Employer dashboard</h1>
          <p className="mt-1 text-ink-muted">Post jobs, track applications, and manage listings.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn-primary" data-interaction="employer.overview.postJob">
          Post a job
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Employer KPIs">
        {employerKpis.map((kpi) => (
          <Link
            key={kpi.id}
            to={kpi.href}
            className="rounded-md border border-surface-border bg-white p-4 shadow-sm transition hover:border-primary-500 hover:shadow-elevate"
            data-interaction={`employer.kpi.${kpi.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-ink-muted">{kpi.label}</p>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
                employer.kpi.{kpi.id}
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{kpi.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaceholderChart title="Applications this month" variant="bar" interactionId="employer.chart.applications" />
        <section className="rounded-md border border-dashed border-surface-border bg-white p-4">
          <h2 className="font-display text-lg font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/employer/jobs" className="font-semibold text-primary-700" data-interaction="employer.overview.myJobs">
                Manage my jobs →
              </Link>
            </li>
            <li>
              <Link
                to="/employer/applications"
                className="font-semibold text-primary-700"
                data-interaction="employer.overview.applications"
              >
                Review applications →
              </Link>
            </li>
            <li>
              <Link to="/employer/jobs/new" className="font-semibold text-primary-700" data-interaction="employer.overview.create">
                Create a new posting →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
