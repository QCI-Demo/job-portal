export type EmployerJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export interface EmployerJob extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  location: string;
  category?: string;
  status: EmployerJobStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployerJobPayload {
  title: string;
  description: string;
  location: string;
  category?: string;
}

export interface UpdateEmployerJobPayload extends CreateEmployerJobPayload {
  status?: EmployerJobStatus;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export const APPLICATION_STATUS_OPTIONS: ApplicationStatus[] = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
];

export interface EmployerApplication extends Record<string, unknown> {
  id: string;
  jobId: string;
  jobTitle?: string;
  applicantName: string;
  applicantEmail: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
}

export interface PaginatedEmployerResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
