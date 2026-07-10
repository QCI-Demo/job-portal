export interface ApplicationPayload {
  jobId: string
  coverLetter: string
  resume?: File
}

export interface ApplicationResponse {
  id: string
  jobId: string
  status: string
  createdAt?: string
}
