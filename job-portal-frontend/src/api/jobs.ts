import axios from 'axios'
import type { Job, JobsListResponse } from '../types/job'
import { apiUrl } from '../config/api'
import { filterMockJobs, getMockJobById } from '../data/mockJobs'

export interface JobSearchParams {
  location?: string
  category?: string
  q?: string
  type?: string
}

function normalizeJobsResponse(data: Job[] | JobsListResponse): Job[] {
  if (Array.isArray(data)) {
    return data
  }
  return data.jobs ?? []
}

function isMockFallbackEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_DATA !== 'false'
}

export async function fetchFeaturedJobs(): Promise<Job[]> {
  try {
    const { data } = await axios.get<Job[] | JobsListResponse>(apiUrl('/jobs'), {
      params: { featured: true },
      timeout: 4000,
    })
    const jobs = normalizeJobsResponse(data)
    if (jobs.length > 0) return jobs
    if (isMockFallbackEnabled()) return filterMockJobs({ featured: true })
    return jobs
  } catch {
    if (isMockFallbackEnabled()) return filterMockJobs({ featured: true })
    throw new Error('Failed to load featured jobs')
  }
}

export async function fetchJobs(params: JobSearchParams = {}): Promise<Job[]> {
  const searchParams = new URLSearchParams()
  if (params.location?.trim()) {
    searchParams.set('location', params.location.trim())
  }
  if (params.category?.trim()) {
    searchParams.set('category', params.category.trim())
  }
  if (params.q?.trim()) {
    searchParams.set('q', params.q.trim())
  }
  if (params.type?.trim()) {
    searchParams.set('type', params.type.trim())
  }

  const query = searchParams.toString()
  const url = query ? `${apiUrl('/jobs')}?${query}` : apiUrl('/jobs')

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 4000)
    const response = await fetch(url, { signal: controller.signal })
    window.clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Failed to load jobs (${response.status})`)
    }

    const data = (await response.json()) as Job[] | JobsListResponse
    const jobs = normalizeJobsResponse(data)
    if (jobs.length === 0 && isMockFallbackEnabled()) {
      return filterMockJobs(params)
    }
    return jobs
  } catch {
    if (isMockFallbackEnabled()) return filterMockJobs(params)
    throw new Error('Failed to load jobs')
  }
}

export async function fetchJobById(id: string): Promise<Job> {
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 4000)
    const response = await fetch(apiUrl(`/jobs/${id}`), { signal: controller.signal })
    window.clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Failed to load job (${response.status})`)
    }

    return response.json() as Promise<Job>
  } catch {
    const mock = isMockFallbackEnabled() ? getMockJobById(id) : undefined
    if (mock) return mock
    throw new Error('Failed to load job')
  }
}
