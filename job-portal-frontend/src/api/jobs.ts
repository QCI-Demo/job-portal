import axios from 'axios'
import type { Job, JobsListResponse } from '../types/job'
import { apiUrl } from '../config/api'

export interface JobSearchParams {
  location?: string
  category?: string
  q?: string
}

function normalizeJobsResponse(data: Job[] | JobsListResponse): Job[] {
  if (Array.isArray(data)) {
    return data
  }
  return data.jobs ?? []
}

export async function fetchFeaturedJobs(): Promise<Job[]> {
  const { data } = await axios.get<Job[] | JobsListResponse>(
    apiUrl('/jobs'),
    { params: { featured: true } },
  )
  return normalizeJobsResponse(data)
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

  const query = searchParams.toString()
  const url = query ? `${apiUrl('/jobs')}?${query}` : apiUrl('/jobs')
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load jobs (${response.status})`)
  }

  const data = (await response.json()) as Job[] | JobsListResponse
  return normalizeJobsResponse(data)
}

export async function fetchJobById(id: string): Promise<Job> {
  const response = await fetch(apiUrl(`/jobs/${id}`))

  if (!response.ok) {
    throw new Error(`Failed to load job (${response.status})`)
  }

  return response.json() as Promise<Job>
}
