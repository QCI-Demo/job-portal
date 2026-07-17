import { apiFetch } from '../client';
import type {
  AdminCategory,
  CreateAdminCategoryPayload,
  PaginatedAdminResponse,
  UpdateAdminCategoryPayload,
} from '../../types/admin';

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await apiFetch<PaginatedAdminResponse<AdminCategory> | AdminCategory[]>(
    '/admin/categories',
  );
  return Array.isArray(response) ? response : response.data;
}

export async function createAdminCategory(
  payload: CreateAdminCategoryPayload,
): Promise<AdminCategory> {
  return apiFetch<AdminCategory>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCategory(
  id: string,
  payload: UpdateAdminCategoryPayload,
): Promise<AdminCategory> {
  return apiFetch<AdminCategory>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await apiFetch<void>(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
}
