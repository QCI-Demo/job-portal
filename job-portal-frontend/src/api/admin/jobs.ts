import { apiFetch } from '../client';
import type {
  AdminJob,
  AdminJobStatus,
  PaginatedAdminResponse,
  UpdateAdminJobPayload,
} from '../../types/admin';

export async function getAdminJobs(): Promise<AdminJob[]> {
  const response = await apiFetch<PaginatedAdminResponse<AdminJob> | AdminJob[]>('/admin/jobs');
  return Array.isArray(response) ? response : response.data;
}

export async function updateAdminJob(
  id: string,
  payload: UpdateAdminJobPayload,
): Promise<AdminJob> {
  return apiFetch<AdminJob>(`/admin/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminJob(id: string): Promise<void> {
  await apiFetch<void>(`/admin/jobs/${id}`, {
    method: 'DELETE',
  });
}

export async function setAdminJobStatus(
  id: string,
  status: AdminJobStatus,
  extra?: Partial<UpdateAdminJobPayload>,
): Promise<AdminJob> {
  return updateAdminJob(id, { ...extra, status });
}
