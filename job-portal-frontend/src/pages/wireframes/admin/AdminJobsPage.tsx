import { useState } from 'react'
import { ConfirmModal } from '../../../components/wireframe/ConfirmModal'
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { adminJobs } from '../../../data/wireframeMock'

export function AdminJobsPage() {
  const [selectedJob, setSelectedJob] = useState<(typeof adminJobs)[number] | null>(adminJobs[0])
  const [rejectOpen, setRejectOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Admin · Jobs</p>
        <h1 className="font-display text-3xl font-bold text-ink">Job moderation</h1>
        <p className="mt-1 text-ink-muted">Review employer postings — approve, reject, or flag content.</p>
      </header>

      <section
        className="flex flex-wrap items-end gap-3 rounded-md border border-dashed border-surface-border bg-white p-4"
        data-interaction="admin.jobs.filters"
      >
        <div className="min-w-[200px] flex-1">
          <label htmlFor="job-search" className="mb-1 block text-sm font-medium">
            Search
          </label>
          <input id="job-search" className="input-field" placeholder="Title or company" />
        </div>
        <div>
          <label htmlFor="job-status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select id="job-status" className="input-field min-w-[160px]" defaultValue="PENDING">
            <option value="">All</option>
            <option>PENDING</option>
            <option>PUBLISHED</option>
            <option>REJECTED</option>
            <option>CLOSED</option>
          </select>
        </div>
        <button type="button" className="btn-secondary" data-interaction="admin.jobs.applyFilters">
          Apply
        </button>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <PlaceholderTable
          caption="Jobs awaiting moderation"
          interactionId="admin.jobs.table"
          rows={adminJobs}
          columns={[
            { key: 'title', header: 'Title', render: (row) => row.title },
            { key: 'company', header: 'Company', render: (row) => row.company },
            { key: 'category', header: 'Category', render: (row) => row.category },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <button
                  type="button"
                  className="text-sm font-semibold text-primary-700"
                  data-interaction={`admin.jobs.open.${row.id}`}
                  onClick={() => setSelectedJob(row)}
                >
                  Review
                </button>
              ),
            },
          ]}
        />

        <section
          className="rounded-md border border-surface-border bg-white p-4"
          data-interaction="admin.jobs.detail"
          aria-label="Job moderation detail"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">Moderation detail</h2>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
              admin.jobs.detail
            </span>
          </div>
          {selectedJob ? (
            <div className="space-y-4">
              <div>
                <p className="font-display text-2xl font-semibold text-ink">{selectedJob.title}</p>
                <p className="text-sm text-ink-muted">
                  {selectedJob.company} · {selectedJob.category} · submitted {selectedJob.submitted}
                </p>
                <div className="mt-2">
                  <StatusBadge status={selectedJob.status} />
                </div>
              </div>
              <div className="rounded-md border border-dashed border-surface-border bg-surface p-3 text-sm text-ink-muted">
                Job description placeholder. Full posting content appears here for review.
              </div>
              <div>
                <label htmlFor="mod-notes" className="mb-1 block text-sm font-medium">
                  Moderator notes
                </label>
                <textarea id="mod-notes" className="input-field min-h-[96px]" placeholder="Optional notes for reject/flag" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-primary" data-interaction="admin.jobs.approve">
                  Approve
                </button>
                <button type="button" className="btn-secondary" data-interaction="admin.jobs.reject" onClick={() => setRejectOpen(true)}>
                  Reject
                </button>
                <button type="button" className="btn-secondary" data-interaction="admin.jobs.flag">
                  Flag
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">Select a job to review.</p>
          )}
        </section>
      </div>

      <ConfirmModal
        open={rejectOpen}
        title="Reject this job?"
        description="The employer will be notified. The posting will move to Rejected status."
        confirmLabel="Reject job"
        destructive
        interactionId="admin.jobs.confirmReject"
        onCancel={() => setRejectOpen(false)}
        onConfirm={() => setRejectOpen(false)}
      />
    </div>
  )
}
