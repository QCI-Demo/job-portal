import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { employerApplications } from '../../../data/wireframeMock'

const statusOptions = ['SUBMITTED', 'IN_REVIEW', 'SHORTLISTED', 'REJECTED'] as const

export function EmployerApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const application = employerApplications.find((item) => item.id === id) ?? employerApplications[0]
  const [status, setStatus] = useState(application.status)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Employer · Application detail</p>
          <h1 className="font-display text-3xl font-bold text-ink">{application.candidate}</h1>
          <p className="mt-1 text-ink-muted">
            Applied to {application.jobTitle} on {application.applied}
          </p>
        </div>
        <Link to="/employer/applications" className="btn-secondary" data-interaction="employer.applicationDetail.back">
          Back to applications
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4 rounded-md border border-surface-border bg-white p-5" data-interaction="employer.applicationDetail.profile">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">Candidate profile</h2>
            <StatusBadge status={status} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink-muted">Email</dt>
              <dd>{application.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Resume</dt>
              <dd>
                <button type="button" className="font-semibold text-primary-700" data-interaction="employer.applicationDetail.resume">
                  {application.resume}
                </button>
              </dd>
            </div>
          </dl>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-muted">Cover letter</h3>
            <p className="rounded-md border border-dashed border-surface-border bg-surface p-3 text-sm text-ink">
              {application.coverLetter}
            </p>
          </div>
        </section>

        <section
          className="space-y-4 rounded-md border border-dashed border-surface-border bg-white p-5"
          data-interaction="employer.applicationDetail.statusPanel"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">Update status</h2>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
              employer.applicationDetail.status
            </span>
          </div>
          <div>
            <label htmlFor="app-status-update" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="app-status-update"
              className="input-field"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="app-notes" className="mb-1 block text-sm font-medium">
              Internal notes
            </label>
            <textarea id="app-notes" className="input-field min-h-[120px]" placeholder="Notes visible only to your team" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" data-interaction="employer.applicationDetail.save">
              Save status
            </button>
            <button type="button" className="btn-secondary" data-interaction="employer.applicationDetail.message">
              Message candidate
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
