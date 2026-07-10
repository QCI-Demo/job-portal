import { apiUrl } from '../config/api'
import { ApiError } from './client'
import type { ApplicationPayload, ApplicationResponse } from '../types/application'

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    return body.message ?? body.error ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

export async function submitApplication(
  payload: ApplicationPayload,
): Promise<ApplicationResponse> {
  const formData = new FormData()
  formData.append('jobId', payload.jobId)
  formData.append('coverLetter', payload.coverLetter)
  if (payload.resume) {
    formData.append('resume', payload.resume)
  }

  const response = await fetch(apiUrl('/applications'), {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<ApplicationResponse>
}
