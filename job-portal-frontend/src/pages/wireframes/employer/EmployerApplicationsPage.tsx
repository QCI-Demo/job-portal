import { Link, useSearchParams } from 'react-router-dom'
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { employerApplications, employerJobs } from '../../../data/wireframeMock'

export function EmployerApplicationsPage() {
  const [params] = useSearchParams()
  const jobId = params.get('jobId') ?? ''
  const status = params.get('status') ?? ''

  const rows = employerApplications.filter((app) => {
    if (jobId && app.jobId !== jobId) return false
    if (status && app.status !== status) return false
    return true
  })

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Employer · Applications</p>
        <h1 className="font-display text-3xl font-bold text-ink">Application review</h1>
        <p className="mt-1 text-ink-muted">Filter by job or status, then open a candidate for review.</p>
      </header>

      <section
        className="flex flex-wrap items-end gap-3 rounded-md border border-dashed border-surface-border bg-white p-4"
        data-interaction="employer.applications.filters"
      >
        <div>
          <label htmlFor="app-job" className="mb-1 block text-sm font-medium">
            Job
          </label>
          <select id="app-job" className="input-field min-w-[200px]" defaultValue={jobId}>
            <option value="">All jobs</option>
            {employerJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="app-status" className="input-field min-w-[160px]" defaultValue={status}>
            <option value="">All</option>
            <option>SUBMITTED</option>
            <option>IN_REVIEW</option>
            <option>SHORTLISTED</option>
            <option>REJECTED</option>
          </select>
        </div>
        <button type="button" className="btn-secondary" data-interaction="employer.applications.applyFilters">
          Apply
        </button>
      </section>

      <PlaceholderTable
        caption="Applications"
        interactionId="employer.applications.table"
        rows={rows}
        columns={[
          { key: 'candidate', header: 'Candidate', render: (row) => row.candidate },
          { key: 'jobTitle', header: 'Job', render: (row) => row.jobTitle },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'applied', header: 'Applied', render: (row) => row.applied },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Link
                to={`/employer/applications/${row.id}`}
                className="text-sm font-semibold text-primary-700"
                data-interaction={`employer.applications.open.${row.id}`}
              >
                Review
              </Link>
            ),
          },
        ]}
      />
    </div>
  )
}
