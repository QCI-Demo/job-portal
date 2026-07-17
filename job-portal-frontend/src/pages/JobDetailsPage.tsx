import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchJobById } from '../api/jobs'
import { Layout } from '../components/Layout'
import type { Job } from '../types/job'
import { getCompanyName } from '../types/job'

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function loadJob() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchJobById(id as string)
        if (!cancelled) setJob(data)
      } catch {
        if (!cancelled) {
          setError(
            'Unable to load this job. It may have been removed or is temporarily unavailable.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadJob()
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-4 py-8" role="alert">
          <p className="text-red-800">Invalid job identifier.</p>
          <Link to="/jobs" className="mt-4 inline-block text-primary-700 underline">
            Back to job search
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <article
        className="mx-auto max-w-container px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8"
        aria-labelledby="job-detail-title"
      >
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-ink-muted" role="list">
            <li>
              <Link to="/" className="hover:text-primary-700 focus:outline-none focus-visible:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/jobs"
                className="hover:text-primary-700 focus:outline-none focus-visible:underline"
              >
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink" aria-current="page">
              {job?.title ?? 'Job details'}
            </li>
          </ol>
        </nav>

        {loading && (
          <p role="status" aria-live="polite" className="text-ink-muted">
            Loading job details…
          </p>
        )}

        {error && (
          <div role="alert" className="rounded-md bg-red-50 p-4 text-red-800">
            <p>{error}</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block font-medium text-primary-700 underline hover:text-primary-800"
            >
              Back to job search
            </Link>
          </div>
        )}

        {!loading && !error && job && (
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <header className="border-b border-surface-border pb-6">
                <h1
                  id="job-detail-title"
                  className="font-display text-3xl font-bold text-ink sm:text-4xl"
                >
                  {job.title}
                </h1>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-ink-muted">Company</dt>
                    <dd className="text-ink">{getCompanyName(job.company)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink-muted">Location</dt>
                    <dd className="text-ink">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink-muted">Category</dt>
                    <dd className="capitalize text-ink">{job.category}</dd>
                  </div>
                  {job.employmentType && (
                    <div>
                      <dt className="font-medium text-ink-muted">Employment type</dt>
                      <dd className="text-ink">{job.employmentType}</dd>
                    </div>
                  )}
                  {job.postedAt && (
                    <div>
                      <dt className="font-medium text-ink-muted">Posted</dt>
                      <dd className="text-ink">
                        {new Date(job.postedAt).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </header>

              <section className="mt-8" aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-lg font-semibold text-ink">
                  Description
                </h2>
                <div className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-secondary">
                  {job.description}
                </div>
              </section>

              <section className="mt-8" aria-labelledby="requirements-heading">
                <h2 id="requirements-heading" className="text-lg font-semibold text-ink">
                  Requirements
                </h2>
                <div className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-secondary">
                  {job.requirements}
                </div>
              </section>

              {job.benefits && (
                <section className="mt-8" aria-labelledby="benefits-heading">
                  <h2 id="benefits-heading" className="text-lg font-semibold text-ink">
                    Benefits
                  </h2>
                  <div className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-secondary">
                    {job.benefits}
                  </div>
                </section>
              )}

              <div className="mt-10 hidden lg:block">
                <Link to="/jobs" className="btn-secondary">
                  Back to search
                </Link>
              </div>
            </div>

            <aside className="hidden lg:block" aria-label="Apply actions">
              <div className="sticky top-24 rounded-xl border border-surface-border bg-white p-5 shadow-card">
                <p className="text-sm text-ink-muted">Ready to apply?</p>
                <p className="mt-1 font-medium text-ink">{getCompanyName(job.company)}</p>
                <Link
                  to={`/jobs/${job.id}/apply`}
                  className="btn-primary mt-4 w-full"
                  aria-label={`Apply for ${job.title} at ${getCompanyName(job.company)}`}
                >
                  Apply now
                </Link>
                <Link to="/jobs" className="btn-secondary mt-3 w-full !text-sm">
                  Back to search
                </Link>
              </div>
            </aside>
          </div>
        )}
      </article>

      {!loading && !error && job && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-white/95 p-3 shadow-elevate backdrop-blur lg:hidden safe-area-pb">
          <Link
            to={`/jobs/${job.id}/apply`}
            className="btn-primary w-full"
            aria-label={`Apply for ${job.title} at ${getCompanyName(job.company)}`}
          >
            Apply now
          </Link>
        </div>
      )}
    </Layout>
  )
}
