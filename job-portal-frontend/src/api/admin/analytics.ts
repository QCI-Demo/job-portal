import { apiFetch } from '../client';
import type { AdminAnalytics } from '../../types/admin';

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  return apiFetch<AdminAnalytics>('/admin/analytics');
}
