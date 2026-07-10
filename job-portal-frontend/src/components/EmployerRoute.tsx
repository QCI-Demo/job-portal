import type { ReactNode } from 'react';
import { RBACGate } from './withRBAC';

interface EmployerRouteProps {
  children: ReactNode;
}

/**
 * Employer-only route guard. Unauthorized access is audited and redirected to `/403`.
 */
export function EmployerRoute({ children }: EmployerRouteProps) {
  return (
    <RBACGate allowedRoles={['employer']} forbiddenPath="/403">
      {children}
    </RBACGate>
  );
}
