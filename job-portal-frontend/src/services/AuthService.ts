import { jwtDecode } from 'jwt-decode';
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/jwt';

/** Canonical application roles used for client-side RBAC. */
export type AppRole = 'admin' | 'employer' | 'candidate';

export interface AuthJwtPayload {
  sub?: string;
  email?: string;
  role?: string | string[];
  roles?: string | string[];
  exp?: number;
  iat?: number;
  [claim: string]: unknown;
}

const ROLE_CLAIM_KEYS = ['role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as const;

function normalizeRole(value: string): string {
  return value.trim().toLowerCase();
}

function collectRolesFromClaim(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(normalizeRole)
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map(normalizeRole)
      .filter(Boolean);
  }

  return [];
}

/**
 * Decode a JWT and extract role claims.
 * Supports `role`, `roles`, and the common Microsoft role claim URI.
 */
export function parseToken(token: string): AuthJwtPayload | null {
  try {
    return jwtDecode<AuthJwtPayload>(token);
  } catch {
    return null;
  }
}

/**
 * Extract normalized role names from a JWT payload or raw token string.
 */
export function getRoles(tokenOrPayload?: string | AuthJwtPayload | null): string[] {
  let payload: AuthJwtPayload | null;

  if (typeof tokenOrPayload === 'string') {
    payload = parseToken(tokenOrPayload);
  } else if (tokenOrPayload && typeof tokenOrPayload === 'object') {
    payload = tokenOrPayload;
  } else {
    const stored = getStoredToken();
    payload = stored ? parseToken(stored) : null;
  }

  if (!payload) {
    return [];
  }

  const roles = new Set<string>();

  for (const key of ROLE_CLAIM_KEYS) {
    for (const role of collectRolesFromClaim(payload[key])) {
      roles.add(role);
    }
  }

  return Array.from(roles);
}

export function getRole(token?: string | null): string | null {
  const roles = getRoles(token ?? getStoredToken());
  return roles[0] ?? null;
}

export function hasRole(role: string, token?: string | null): boolean {
  return getRoles(token ?? getStoredToken()).includes(normalizeRole(role));
}

export function hasAnyRole(allowedRoles: string[], token?: string | null): boolean {
  const userRoles = getRoles(token ?? getStoredToken());
  return allowedRoles.some((role) => userRoles.includes(normalizeRole(role)));
}

export function isAdmin(token?: string | null): boolean {
  return hasRole('admin', token);
}

export function isEmployer(token?: string | null): boolean {
  return hasRole('employer', token);
}

export function isAuthenticated(): boolean {
  const token = getStoredToken();
  if (!token) {
    return false;
  }

  const payload = parseToken(token);
  if (!payload) {
    return false;
  }

  if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
    return false;
  }

  return true;
}

export function getToken(): string | null {
  return getStoredToken();
}

export function setToken(token: string): void {
  setStoredToken(token);
}

export function clearAuth(): void {
  clearStoredToken();
}

/** Role helpers and token utilities for the rest of the app. */
export const AuthService = {
  parseToken,
  getRoles,
  getRole,
  hasRole,
  hasAnyRole,
  isAdmin,
  isEmployer,
  isAuthenticated,
  getToken,
  setToken,
  clearAuth,
};

export default AuthService;
