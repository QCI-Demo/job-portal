import { apiFetch } from '../client'
import type { AdminJob, PaginatedResponse, UpdateAdminJobPayload } from '../../types/admin'

export async function getAdminJobs(): Promise<AdminJob[]> {
  const response = await apiFetch<PaginatedResponse<AdminJob> | AdminJob[]>('/admin/jobs')
  return Array.isArray(response) ? response : response.data
}

export async function updateAdminJob(id: string, payload: UpdateAdminJobPayload): Promise<AdminJob> {
  return apiFetch<AdminJob>(`/admin/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminJob(id: string): Promise<void> {
  await apiFetch<void>(`/admin/jobs/${id}`, { method: 'DELETE' })
}
