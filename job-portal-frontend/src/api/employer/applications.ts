import { apiFetch } from '../client';
import type {
  ApplicationStatus,
  EmployerApplication,
  PaginatedEmployerResponse,
} from '../../types/employer';

export interface GetEmployerApplicationsParams {
  jobId?: string;
  status?: ApplicationStatus | '';
  page?: number;
}

export async function getEmployerApplications(
  params: GetEmployerApplicationsParams = {},
): Promise<EmployerApplication[]> {
  const searchParams = new URLSearchParams();

  if (params.jobId) {
    searchParams.set('jobId', params.jobId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  const query = searchParams.toString();
  const path = query ? `/employer/applications?${query}` : '/employer/applications';

  const response = await apiFetch<
    PaginatedEmployerResponse<EmployerApplication> | EmployerApplication[]
  >(path);
  return Array.isArray(response) ? response : response.data;
}
