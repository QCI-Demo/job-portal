export { AuthService, default } from './AuthService';
export {
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
} from './AuthService';
export type { AppRole, AuthJwtPayload } from './AuthService';

export { AuditService } from './AuditService';
export { logUnauthorized } from './AuditService';
export type { UnauthorizedAccessEvent } from './AuditService';
