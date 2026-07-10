import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedJobs } from '../api/jobs'
import { Carousel } from '../components/Carousel'
import { JobCard } from '../components/JobCard'
import { Layout } from '../components/Layout'
import type { Job } from '../types/job'

export function HomePage() {
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
        if (!cancelled) {
          setFeaturedJobs(jobs)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load featured jobs. Please try again later.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadFeatured()
    return () => {
      cancelled = true
    }
  }, [])

  const carouselItems = featuredJobs.map((job) => (
    <JobCard key={job.id} job={job} />
  ))

  return (
    <Layout>
      <section
        className="bg-gradient-to-br from-primary-700 to-primary-500 text-white"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 id="hero-heading" className="text-3xl font-bold tracking-tight sm:text-5xl">
            Find your next career opportunity
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Browse thousands of roles from top employers. Start your job search today and
            take the next step in your professional journey.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary-700 shadow hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
            >
              Search jobs
            </Link>
            <a
              href="#featured-jobs"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
            >
              Featured roles
            </a>
          </div>
        </div>
      </section>

      <section
        id="featured-jobs"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        aria-labelledby="featured-heading"
      >
        <h2 id="featured-heading" className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Featured jobs
        </h2>
        <p className="mt-2 text-slate-600">
          Hand-picked opportunities updated regularly. Use arrow keys to browse the carousel.
        </p>

        {loading && (
          <p className="mt-8 text-slate-600" role="status" aria-live="polite">
            Loading featured jobs…
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-md bg-red-50 p-4 text-red-800" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-8 max-w-3xl">
            <Carousel items={carouselItems} label="Featured job listings" />
          </div>
        )}
      </section>
    </Layout>
  )
}
