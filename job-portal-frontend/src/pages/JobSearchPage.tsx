import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

const TYPE_OPTIONS = [
  { value: '', label: 'All job types' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'relevance', label: 'Relevance' },
]

function paramsFromSearch(searchParams: URLSearchParams): JobSearchParams {
  return {
    q: searchParams.get('q') || undefined,
    location: searchParams.get('location') || undefined,
    category: searchParams.get('category') || undefined,
    type: searchParams.get('type') || undefined,
  }
}

interface FilterFormProps {
  initial: JobSearchParams
  onApply: (next: JobSearchParams) => void
  onReset: () => void
}

function FilterForm({ initial, onApply, onReset }: FilterFormProps) {
  const [location, setLocation] = useState(initial.location ?? '')
  const [category, setCategory] = useState(initial.category ?? '')
  const [keyword, setKeyword] = useState(initial.q ?? '')
  const [jobType, setJobType] = useState(initial.type ?? '')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onApply({
      location: location || undefined,
      category: category || undefined,
      q: keyword || undefined,
      type: jobType || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Job search filters">
      <div>
        <label htmlFor="search-keyword" className="mb-1 block text-sm font-medium text-ink-secondary">
          Keywords
        </label>
        <input
          id="search-keyword"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title or skill"
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="search-location" className="mb-1 block text-sm font-medium text-ink-secondary">
          Location
        </label>
        <input
          id="search-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or remote"
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="search-category" className="mb-1 block text-sm font-medium text-ink-secondary">
          Category
        </label>
        <select
          id="search-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="search-type" className="mb-1 block text-sm font-medium text-ink-secondary">
          Job type
        </label>
        <select
          id="search-type"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="input-field"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value || 'all-types'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <button type="submit" className="btn-primary w-full !py-2.5 !text-sm">
          Apply filters
        </button>
        <button type="button" onClick={onReset} className="btn-secondary w-full !py-2.5 !text-sm">
          Reset
        </button>
      </div>
    </form>
  )
}

export function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const appliedFilters = useMemo(() => paramsFromSearch(searchParams), [searchParams])
  const sort = searchParams.get('sort') || 'newest'
  const currentPage = Number(searchParams.get('page') || 1) || 1
  const filterKey = searchParams.toString()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const results = await fetchJobs(appliedFilters)
        if (!cancelled) setJobs(results)
      } catch {
        if (!cancelled) {
          setError('Unable to load jobs. Please check your connection and try again.')
          setJobs([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [appliedFilters])

  const sortedJobs = useMemo(() => {
    const copy = [...jobs]
    if (sort === 'relevance' && appliedFilters.q) {
      const q = appliedFilters.q.toLowerCase()
      copy.sort((a, b) => {
        const aScore = a.title.toLowerCase().includes(q) ? 1 : 0
        const bScore = b.title.toLowerCase().includes(q) ? 1 : 0
        return bScore - aScore
      })
    } else {
      copy.sort((a, b) => (b.postedAt ?? '').localeCompare(a.postedAt ?? ''))
    }
    return copy
  }, [jobs, sort, appliedFilters.q])

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / ITEMS_PER_PAGE))
  const effectivePage = Math.min(currentPage, totalPages)

  const paginatedJobs = useMemo(() => {
    const start = (effectivePage - 1) * ITEMS_PER_PAGE
    return sortedJobs.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedJobs, effectivePage])

  const syncUrl = (next: JobSearchParams & { sort?: string; page?: number }) => {
    const params = new URLSearchParams()
    if (next.q) params.set('q', next.q)
    if (next.location) params.set('location', next.location)
    if (next.category) params.set('category', next.category)
    if (next.type) params.set('type', next.type)
    if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
    if (next.page && next.page > 1) params.set('page', String(next.page))
    setSearchParams(params)
  }

  const resultsSummary =
    sortedJobs.length === 0
      ? 'No jobs found'
      : `Showing ${(effectivePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(effectivePage * ITEMS_PER_PAGE, sortedJobs.length)} of ${sortedJobs.length} jobs`

  const handleApplyFilters = (next: JobSearchParams) => {
    setFiltersOpen(false)
    syncUrl({ ...next, sort, page: 1 })
  }

  const handleResetFilters = () => {
    setFiltersOpen(false)
    setSearchParams({})
  }

  return (
    <Layout>
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Job search</h1>
          <p className="mt-2 text-ink-muted">
            Filter by location, category, or keywords to find roles that match your goals.
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            className="btn-secondary !px-4 !py-2 !text-sm"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(true)}
          >
            Filters
          </button>
          <div aria-live="polite" aria-atomic="true" className="text-sm text-ink-muted">
            {loading ? 'Loading…' : resultsSummary}
          </div>
        </div>

        {filtersOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Job filters"
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white p-5 shadow-elevate">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Filters</h2>
                <button
                  type="button"
                  className="btn-secondary !min-h-[40px] !px-3 !py-2 !text-sm"
                  onClick={() => setFiltersOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="overflow-y-auto">
                <FilterForm
                  key={`mobile-${filterKey}`}
                  initial={appliedFilters}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters sidebar">
            <div className="sticky top-24 rounded-xl border border-surface-border bg-white p-5 shadow-card">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-secondary">
                Filters
              </h2>
              <FilterForm
                key={`desktop-${filterKey}`}
                initial={appliedFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          <div>
            <div className="mb-4 hidden items-center justify-between gap-4 lg:flex">
              <div aria-live="polite" aria-atomic="true" className="text-sm text-ink-muted">
                {loading ? 'Loading jobs…' : resultsSummary}
              </div>
              <div>
                <label htmlFor="sort-jobs" className="sr-only">
                  Sort jobs
                </label>
                <select
                  id="sort-jobs"
                  value={sort}
                  onChange={(e) => {
                    syncUrl({ ...appliedFilters, sort: e.target.value, page: 1 })
                  }}
                  className="input-field !w-auto !py-2 !text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sort: {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-md bg-red-50 p-4 text-red-800" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && sortedJobs.length === 0 && (
              <p className="rounded-lg border border-dashed border-surface-border bg-white p-8 text-center text-ink-muted">
                No jobs match your filters. Try adjusting your search criteria.
              </p>
            )}

            {!loading && paginatedJobs.length > 0 && (
              <ul
                className="grid gap-4 sm:grid-cols-2"
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

            {!loading && sortedJobs.length > 0 && (
              <Pagination
                currentPage={effectivePage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  syncUrl({ ...appliedFilters, sort, page })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
