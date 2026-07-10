import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchFeaturedJobs } from '../api/jobs'
import { JobCard } from '../components/JobCard'
import { Layout } from '../components/Layout'
import type { Job } from '../types/job'

const HOW_IT_WORKS = [
  {
    title: 'Search roles',
    body: 'Filter by keyword, location, and category to find openings that fit your goals.',
  },
  {
    title: 'Review details',
    body: 'Read full descriptions, requirements, and company context before you apply.',
  },
  {
    title: 'Apply with confidence',
    body: 'Sign in, submit your cover letter and resume, then track your profile in one place.',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadFeatured() {
      setLoading(true)
      setError(null)
      try {
        const jobs = await fetchFeaturedJobs()
        if (!cancelled) setFeaturedJobs(jobs)
      } catch {
        if (!cancelled) {
          setError('Unable to load featured jobs. Please try again later.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadFeatured()
    return () => {
      cancelled = true
    }
  }, [])

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(params.toString() ? `/jobs?${params}` : '/jobs')
  }

  return (
    <Layout>
      <section
        className="relative overflow-hidden border-b border-primary-800/20 bg-gradient-to-br from-primary-800 via-primary-600 to-primary-500 text-white"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2), transparent 35%)',
          }}
        />
        <div className="relative mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-100">
            JobPortal
          </p>
          <h1
            id="hero-heading"
            className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Find your next career opportunity
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-50 sm:text-xl">
            Browse roles from trusted employers, apply in minutes, and keep your candidate profile
            ready for what comes next.
          </p>

          <form
            onSubmit={onSearch}
            className="mt-8 flex max-w-2xl flex-col gap-3 rounded-xl bg-white/95 p-3 shadow-elevate backdrop-blur sm:flex-row sm:items-end"
            role="search"
            aria-label="Search jobs from home"
          >
            <div className="flex-1">
              <label htmlFor="home-search" className="mb-1 block text-sm font-medium text-ink-secondary">
                Keywords
              </label>
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, skill, or company"
                className="input-field border-surface-border text-ink"
              />
            </div>
            <button type="submit" className="btn-primary sm:mb-0.5">
              Search jobs
            </button>
          </form>
        </div>
      </section>

      <section
        id="featured-jobs"
        className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8"
        aria-labelledby="featured-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="font-display text-3xl font-bold text-ink">
              Featured jobs
            </h2>
            <p className="mt-2 text-ink-muted">Hand-picked openings updated regularly.</p>
          </div>
          <Link to="/jobs" className="btn-secondary !min-h-[40px] !px-4 !py-2 !text-sm">
            View all jobs
          </Link>
        </div>

        {loading && (
          <p className="mt-8 text-ink-muted" role="status" aria-live="polite">
            Loading featured jobs…
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-md bg-red-50 p-4 text-red-800" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <ul
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Featured job listings"
          >
            {featuredJobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="border-y border-surface-border bg-white/70"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="how-heading" className="font-display text-3xl font-bold text-ink">
            How it works
          </h2>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Three clear steps from discovery to application — designed for keyboard and screen-reader
            users as well as mouse and touch.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3" role="list">
            {HOW_IT_WORKS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-surface-border bg-white p-6 shadow-card transition hover:shadow-elevate"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-display text-lg font-bold text-primary-800"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  )
}
