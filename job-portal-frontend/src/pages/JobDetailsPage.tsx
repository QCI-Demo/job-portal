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
        if (!cancelled) {
          setJob(data)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load this job. It may have been removed or is temporarily unavailable.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
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
        className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
        aria-labelledby="job-detail-title"
      >
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-slate-600" role="list">
            <li>
              <Link to="/jobs" className="hover:text-primary-600 focus:outline-none focus-visible:underline">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-900" aria-current="page">
              Job details
            </li>
          </ol>
        </nav>

        {loading && (
          <p role="status" aria-live="polite" className="text-slate-600">
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
          <>
            <header className="border-b border-slate-200 pb-6">
              <h1 id="job-detail-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {job.title}
              </h1>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">Company</dt>
                  <dd className="text-slate-900">{getCompanyName(job.company)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Location</dt>
                  <dd className="text-slate-900">{job.location}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Category</dt>
                  <dd className="text-slate-900">{job.category}</dd>
                </div>
              </dl>
            </header>

            <section className="mt-8" aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-lg font-semibold text-slate-900">
                Description
              </h2>
              <div className="mt-3 whitespace-pre-wrap text-slate-700">{job.description}</div>
            </section>

            <section className="mt-8" aria-labelledby="requirements-heading">
              <h2 id="requirements-heading" className="text-lg font-semibold text-slate-900">
                Requirements
              </h2>
              <div className="mt-3 whitespace-pre-wrap text-slate-700">{job.requirements}</div>
            </section>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to={`/jobs/${job.id}/apply`}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label={`Apply for ${job.title} at ${getCompanyName(job.company)}`}
              >
                Apply now
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Back to search
              </Link>
            </div>
          </>
        )}
      </article>
    </Layout>
  )
}
