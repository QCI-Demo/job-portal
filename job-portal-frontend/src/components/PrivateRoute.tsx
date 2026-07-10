import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRolesFromToken, hasRequiredRole } from '../utils/jwt';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  /** Role required to access the route. Defaults to `admin`. */
  requiredRole?: string;
}

/**
 * Protected route that requires authentication and a JWT role match.
 * Unauthenticated users are redirected to login; wrong role → /forbidden.
 */
export function PrivateRoute({ children, requiredRole = 'admin' }: PrivateRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="px-4 py-16 text-center text-slate-600">
        Checking your session…
      </p>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  const tokenRoles = getRolesFromToken();
  const userRoles = user?.roles ?? tokenRoles;
  const roles = userRoles.length > 0 ? userRoles : tokenRoles;

  if (!hasRequiredRole(roles, requiredRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
