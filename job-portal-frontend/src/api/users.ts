import { apiFetch } from './client'
import type { UpdateProfilePayload, User } from '../types/user'

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/users/me')
}

export async function updateCurrentUser(payload: UpdateProfilePayload): Promise<User> {
  return apiFetch<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
