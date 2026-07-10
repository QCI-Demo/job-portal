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
      className={`flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
      aria-labelledby={`job-title-${job.id}`}
    >
      <h3 id={`job-title-${job.id}`} className="text-lg font-semibold text-slate-900">
        {job.title}
      </h3>
      <p className="mt-1 text-sm text-slate-600">{getCompanyName(job.company)}</p>
      <p className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
        <span>{job.location}</span>
        <span aria-hidden="true">·</span>
        <span>{job.category}</span>
      </p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-700">
        {job.description}
      </p>
      <Link
        to={`/jobs/${job.id}`}
        className="mt-4 inline-flex w-fit items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        View details
      </Link>
    </article>
  )
}
