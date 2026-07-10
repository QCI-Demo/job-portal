import { apiFetch } from './client';
import type { LoginPayload, RegisterPayload, User } from '../types/user';
import { clearStoredToken, setStoredToken } from '../utils/jwt';

interface AuthResponse {
  user?: User;
  token?: string;
}

function applyAuthResponse(response: User | AuthResponse): User {
  if ('id' in response) {
    return response;
  }

  if (response.token) {
    setStoredToken(response.token);
  }

  if (!response.user) {
    throw new Error('Invalid authentication response');
  }

  return response.user;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await apiFetch<User | AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return applyAuthResponse(response);
}

export async function login(payload: LoginPayload): Promise<User> {
  const response = await apiFetch<User | AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return applyAuthResponse(response);
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>('/auth/logout', { method: 'POST' });
  } catch {
    // Clear client state even if logout endpoint is unavailable
  } finally {
    clearStoredToken();
  }
}
