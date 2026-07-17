import {
  useEffect,
  useRef,
  type ComponentType,
  type ReactNode,
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuditService } from '../services/AuditService';
import { AuthService, getRoles } from '../services/AuthService';

export type AllowedRole = string;

export interface WithRBACOptions {
  /** Roles permitted to render the wrapped component. */
  allowedRoles: AllowedRole[];
  /** Path to redirect unauthorized users. Defaults to `/403`. */
  forbiddenPath?: string;
}

function resolveUserRoles(userRoles?: string[] | null): string[] {
  const fromUser = (userRoles ?? []).map((role) => role.trim().toLowerCase()).filter(Boolean);
  if (fromUser.length > 0) {
    return fromUser;
  }
  return getRoles();
}

function userHasAllowedRole(userRoles: string[], allowedRoles: AllowedRole[]): boolean {
  const allowed = allowedRoles.map((role) => role.trim().toLowerCase());
  return userRoles.some((role) => allowed.includes(role));
}

interface RBACGateProps {
  allowedRoles: AllowedRole[];
  forbiddenPath: string;
  children: ReactNode;
}

/**
 * Runtime gate used by the HOC and by route wrappers.
 * Logs unauthorized access and redirects to the forbidden page.
 */
export function RBACGate({ allowedRoles, forbiddenPath, children }: RBACGateProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const loggedRef = useRef<string | null>(null);

  const userRoles = resolveUserRoles(user?.roles);
  const authorized = isAuthenticated && userHasAllowedRole(userRoles, allowedRoles);
  const attemptedPath = location.pathname + location.search;
  const rolesKey = userRoles.join(',');
  const allowedKey = allowedRoles.join(',');

  useEffect(() => {
    if (loading || authorized) {
      return;
    }

    // Avoid duplicate audit entries for the same path in Strict Mode remounts.
    if (loggedRef.current === attemptedPath) {
      return;
    }
    loggedRef.current = attemptedPath;

    void AuditService.logUnauthorized({
      attemptedPath,
      userRole: userRoles[0] ?? AuthService.getRole(),
      allowedRoles: allowedKey.split(',').filter(Boolean),
      userId: user?.id ?? null,
    });
    // rolesKey/allowedKey stabilize array identity for the effect deps
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional stable keys
  }, [loading, authorized, attemptedPath, allowedKey, rolesKey, user?.id]);

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="px-4 py-16 text-center text-slate-600">
        Checking your session…
      </p>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(attemptedPath);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  if (!authorized) {
    return <Navigate to={forbiddenPath} replace />;
  }

  return children;
}

/**
 * Higher-order component that enforces role-based access on a wrapped component.
 * Unauthorized users are redirected to `/403` and the attempt is audited.
 *
 * @example
 * const AdminOnly = withRBAC(AdminDashboard, { allowedRoles: ['admin'] });
 */
// eslint-disable-next-line react-refresh/only-export-components -- HOC factory colocated with RBACGate
export function withRBAC<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithRBACOptions | AllowedRole[],
) {
  const config: WithRBACOptions = Array.isArray(options)
    ? { allowedRoles: options }
    : options;

  const { allowedRoles, forbiddenPath = '/403' } = config;

  function WithRBACComponent(props: P) {
    return (
      <RBACGate allowedRoles={allowedRoles} forbiddenPath={forbiddenPath}>
        <WrappedComponent {...props} />
      </RBACGate>
    );
  }

  const wrappedName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';
  WithRBACComponent.displayName = `withRBAC(${wrappedName})`;

  return WithRBACComponent;
}

// eslint-disable-next-line react-refresh/only-export-components -- default export of HOC factory
export default withRBAC;
