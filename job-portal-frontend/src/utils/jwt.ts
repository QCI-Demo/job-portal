export interface JwtPayload {
  sub?: string;
  role?: string;
  roles?: string[];
  exp?: number;
}

const TOKEN_KEY = 'authToken';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(payload);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRolesFromToken(token?: string | null): string[] {
  const value = token ?? getStoredToken();
  if (!value) return [];

  const payload = decodeJwt(value);
  if (!payload) return [];

  if (Array.isArray(payload.roles) && payload.roles.length > 0) {
    return payload.roles.map((role) => role.toLowerCase());
  }

  if (payload.role) {
    return [payload.role.toLowerCase()];
  }

  return [];
}

export function hasRequiredRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.map((role) => role.toLowerCase()).includes(requiredRole.toLowerCase());
}
