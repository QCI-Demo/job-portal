import { apiFetch } from '../client';
import type { AdminSettings } from '../../types/admin';

export async function getAdminSettings(): Promise<AdminSettings> {
  return apiFetch<AdminSettings>('/admin/settings');
}

export async function updateAdminSettings(payload: AdminSettings): Promise<AdminSettings> {
  return apiFetch<AdminSettings>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
