import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfirmModal } from '../../../components/wireframe/ConfirmModal'
import { employerJobs } from '../../../data/wireframeMock'

export function EmployerJobFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const existing = employerJobs.find((job) => job.id === id)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Employer · Job form</p>
          <h1 className="font-display text-3xl font-bold text-ink">{isEdit ? 'Edit job' : 'Post a job'}</h1>
          <p className="mt-1 text-ink-muted">
            {isEdit ? 'Update listing details or deactivate the posting.' : 'Create a draft or publish immediately.'}
          </p>
        </div>
        <Link to="/employer/jobs" className="btn-secondary" data-interaction="employer.jobForm.back">
          Back to jobs
        </Link>
      </header>

      <form
        className="max-w-3xl space-y-5 rounded-md border border-dashed border-surface-border bg-white p-5"
        data-interaction="employer.jobForm"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold">Job details</h2>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
            employer.jobForm
          </span>
        </div>

        <div>
          <label htmlFor="job-title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input id="job-title" className="input-field" required defaultValue={existing?.title ?? ''} placeholder="e.g. Frontend Developer" />
        </div>

        <div>
          <label htmlFor="job-location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input id="job-location" className="input-field" required defaultValue={existing?.location ?? ''} placeholder="Remote or city" />
        </div>

        <div>
          <label htmlFor="job-category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <select id="job-category" className="input-field" defaultValue="Engineering">
            <option>Engineering</option>
            <option>Design</option>
            <option>Analytics</option>
            <option>Support</option>
          </select>
        </div>

        <div>
          <label htmlFor="job-description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="job-description"
            className="input-field min-h-[160px]"
            required
            defaultValue={
              isEdit
                ? 'Existing job description placeholder for wireframe review. Include responsibilities, requirements, and benefits.'
                : ''
            }
            placeholder="Describe the role, requirements, and benefits"
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-surface-border pt-4">
          <button type="submit" className="btn-primary" data-interaction="employer.jobForm.publish">
            {isEdit ? 'Save changes' : 'Publish job'}
          </button>
          <button type="button" className="btn-secondary" data-interaction="employer.jobForm.saveDraft">
            Save draft
          </button>
          {isEdit ? (
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-red-700 px-6 py-3 text-base font-semibold text-white"
              data-interaction="employer.jobForm.deactivate"
              onClick={() => setDeactivateOpen(true)}
            >
              Deactivate job
            </button>
          ) : null}
        </div>
      </form>

      <ConfirmModal
        open={deactivateOpen}
        title="Deactivate this job?"
        description="Candidates will no longer be able to apply. You can create a new posting later."
        confirmLabel="Deactivate"
        destructive
        interactionId="employer.jobForm.confirmDeactivate"
        onCancel={() => setDeactivateOpen(false)}
        onConfirm={() => setDeactivateOpen(false)}
      />
    </div>
  )
}
