import { useEffect, useMemo, useState } from 'react'
import { fetchJobs, type JobSearchParams } from '../api/jobs'
import { JobCard } from '../components/JobCard'
import { Layout } from '../components/Layout'
import { Pagination } from '../components/Pagination'
import type { Job } from '../types/job'

const ITEMS_PER_PAGE = 10

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'hr', label: 'Human Resources' },
]

export function JobSearchPage() {
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<JobSearchParams>({})
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const results = await fetchJobs(appliedFilters)
        if (!cancelled) {
          setJobs(results)
          setCurrentPage(1)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load jobs. Please check your connection and try again.')
          setJobs([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [appliedFilters])

  const totalPages = Math.max(1, Math.ceil(jobs.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)

  const paginatedJobs = useMemo(() => {
    const start = (effectivePage - 1) * ITEMS_PER_PAGE
    return jobs.slice(start, start + ITEMS_PER_PAGE)
  }, [jobs, effectivePage])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedFilters({
      location: location || undefined,
      category: category || undefined,
      q: keyword || undefined,
    })
  }

  const handleReset = () => {
    setLocation('')
    setCategory('')
    setKeyword('')
    setAppliedFilters({})
  }

  const resultsSummary =
    jobs.length === 0
      ? 'No jobs found'
      : `Showing ${(effectivePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(effectivePage * ITEMS_PER_PAGE, jobs.length)} of ${jobs.length} jobs`

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Job search</h1>
          <p className="mt-2 text-slate-600">
            Filter by location, category, or keywords to find roles that match your goals.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:p-6"
          aria-label="Job search filters"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="search-keyword" className="mb-1 block text-sm font-medium text-slate-700">
              Keywords
            </label>
            <input
              id="search-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title or skill"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="search-location" className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              id="search-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or remote"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="search-category" className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="search-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1 sm:flex-row lg:flex-col">
            <button
              type="submit"
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Reset
            </button>
          </div>
        </form>

        <div aria-live="polite" aria-atomic="true" className="mb-4 text-sm text-slate-600">
          {loading ? 'Loading jobs…' : resultsSummary}
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-4 text-red-800" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No jobs match your filters. Try adjusting your search criteria.
          </p>
        )}

        {!loading && paginatedJobs.length > 0 && (
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
            role="list"
            aria-label="Job search results"
          >
            {paginatedJobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}

        {!loading && jobs.length > 0 && (
          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  )
}
