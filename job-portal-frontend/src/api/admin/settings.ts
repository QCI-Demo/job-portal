import { apiFetch } from '../client'
import type { SiteSettings } from '../../types/admin'

export async function getSiteSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/admin/settings')
}

export async function updateSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
