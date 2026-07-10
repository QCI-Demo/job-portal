import { apiFetch } from '../client';
import type {
  CreateEmployerJobPayload,
  EmployerJob,
  PaginatedEmployerResponse,
  UpdateEmployerJobPayload,
} from '../../types/employer';

export async function getEmployerJobs(): Promise<EmployerJob[]> {
  const response = await apiFetch<PaginatedEmployerResponse<EmployerJob> | EmployerJob[]>(
    '/employer/jobs',
  );
  return Array.isArray(response) ? response : response.data;
}

export async function getEmployerJob(id: string): Promise<EmployerJob> {
  return apiFetch<EmployerJob>(`/employer/jobs/${id}`);
}

export async function createEmployerJob(payload: CreateEmployerJobPayload): Promise<EmployerJob> {
  return apiFetch<EmployerJob>('/employer/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateEmployerJob(
  id: string,
  payload: UpdateEmployerJobPayload,
): Promise<EmployerJob> {
  return apiFetch<EmployerJob>(`/employer/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deactivateEmployerJob(id: string, reason?: string): Promise<EmployerJob> {
  return apiFetch<EmployerJob>(`/employer/jobs/${id}/deactivate`, {
    method: 'POST',
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
