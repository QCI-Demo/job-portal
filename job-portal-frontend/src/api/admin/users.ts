import { apiFetch } from '../client'
import type {
  AdminUser,
  CreateAdminUserPayload,
  PaginatedResponse,
  UpdateAdminUserPayload,
} from '../../types/admin'

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiFetch<PaginatedResponse<AdminUser> | AdminUser[]>('/admin/users')
  return Array.isArray(response) ? response : response.data
}

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
  return apiFetch<AdminUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateAdminUser(
  id: string,
  payload: UpdateAdminUserPayload,
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiFetch<void>(`/admin/users/${id}`, { method: 'DELETE' })
}
