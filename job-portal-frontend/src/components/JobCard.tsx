import { Link } from 'react-router-dom'
import type { Job } from '../types/job'
import { getCompanyName } from '../types/job'

interface JobCardProps {
  job: Job
  className?: string
}

export function JobCard({ job, className = '' }: JobCardProps) {
  return (
    <article
      className={`group flex h-full flex-col rounded-lg border border-surface-border bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-elevate ${className}`}
      aria-labelledby={`job-title-${job.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`job-title-${job.id}`} className="text-lg font-semibold text-ink">
          <Link
            to={`/jobs/${job.id}`}
            className="underline-offset-2 hover:text-primary-700 hover:underline focus:outline-none focus-visible:underline"
          >
            {job.title}
          </Link>
        </h3>
        {job.employmentType && (
          <span className="rounded bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-800">
            {job.employmentType}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm font-medium text-ink-secondary">{getCompanyName(job.company)}</p>
      <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-ink-muted">
        <span>{job.location}</span>
        <span aria-hidden="true">·</span>
        <span className="capitalize">{job.category}</span>
        {job.postedAt && (
          <>
            <span aria-hidden="true">·</span>
            <span>
              <span className="sr-only">Posted </span>
              {new Date(job.postedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </>
        )}
      </p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink-secondary">{job.description}</p>
      <Link
        to={`/jobs/${job.id}`}
        className="mt-4 inline-flex min-h-[44px] w-fit items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        View details
      </Link>
    </article>
  )
}
