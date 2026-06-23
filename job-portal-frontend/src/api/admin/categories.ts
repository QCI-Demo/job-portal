import { apiFetch } from '../client'
import type {
  AdminCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../../types/admin'

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return apiFetch<AdminCategory[]>('/admin/categories')
}

export async function createAdminCategory(payload: CreateCategoryPayload): Promise<AdminCategory> {
  return apiFetch<AdminCategory>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateAdminCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<AdminCategory> {
  return apiFetch<AdminCategory>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await apiFetch<void>(`/admin/categories/${id}`, { method: 'DELETE' })
}
