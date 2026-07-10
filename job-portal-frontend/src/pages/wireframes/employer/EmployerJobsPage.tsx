import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmModal } from '../../../components/wireframe/ConfirmModal'
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { employerJobs } from '../../../data/wireframeMock'

export function EmployerJobsPage() {
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Employer · Jobs</p>
          <h1 className="font-display text-3xl font-bold text-ink">My jobs</h1>
          <p className="mt-1 text-ink-muted">List, edit, publish, or deactivate your postings.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn-primary" data-interaction="employer.jobs.create">
          + Post a job
        </Link>
      </header>

      <section
        className="flex flex-wrap items-end gap-3 rounded-md border border-dashed border-surface-border bg-white p-4"
        data-interaction="employer.jobs.filters"
      >
        <div className="min-w-[200px] flex-1">
          <label htmlFor="ej-search" className="mb-1 block text-sm font-medium">
            Search
          </label>
          <input id="ej-search" className="input-field" placeholder="Job title" />
        </div>
        <div>
          <label htmlFor="ej-status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="ej-status" className="input-field min-w-[160px]">
            <option value="">All</option>
            <option>DRAFT</option>
            <option>PUBLISHED</option>
            <option>CLOSED</option>
          </select>
        </div>
        <button type="button" className="btn-secondary" data-interaction="employer.jobs.applyFilters">
          Apply
        </button>
      </section>

      <PlaceholderTable
        caption="Employer job listings"
        interactionId="employer.jobs.table"
        rows={employerJobs}
        columns={[
          { key: 'title', header: 'Title', render: (row) => row.title },
          { key: 'location', header: 'Location', render: (row) => row.location },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'applications', header: 'Applications', render: (row) => row.applications },
          { key: 'updated', header: 'Updated', render: (row) => row.updated },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/employer/jobs/${row.id}/edit`}
                  className="text-sm font-semibold text-primary-700"
                  data-interaction={`employer.jobs.edit.${row.id}`}
                >
                  Edit
                </Link>
                <Link
                  to={`/employer/applications?jobId=${row.id}`}
                  className="text-sm font-semibold text-primary-700"
                  data-interaction={`employer.jobs.apps.${row.id}`}
                >
                  Applications
                </Link>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700"
                  data-interaction={`employer.jobs.deactivate.${row.id}`}
                  onClick={() => {
                    setSelectedTitle(row.title)
                    setDeactivateOpen(true)
                  }}
                >
                  Deactivate
                </button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmModal
        open={deactivateOpen}
        title="Deactivate job?"
        description={`“${selectedTitle}” will no longer accept applications and will be hidden from public search.`}
        confirmLabel="Deactivate"
        destructive
        interactionId="employer.jobs.confirmDeactivate"
        onCancel={() => setDeactivateOpen(false)}
        onConfirm={() => setDeactivateOpen(false)}
      />
    </div>
  )
}
