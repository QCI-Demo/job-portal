import type { ReactNode } from 'react';
import { RBACGate } from './withRBAC';

interface PrivateRouteProps {
  children: ReactNode;
  /** Role required to access the route. Defaults to `admin`. */
  requiredRole?: string;
}

/**
 * Protected route that requires authentication and a matching role.
 * Unauthorized access is audited and redirected to `/403` via RBACGate.
 */
export function PrivateRoute({ children, requiredRole = 'admin' }: PrivateRouteProps) {
  return (
    <RBACGate allowedRoles={[requiredRole]} forbiddenPath="/403">
      {children}
    </RBACGate>
  );
}
