import { AdminLayout as AdminLayoutBase } from './admin/AdminLayout';
import { EmployerLayout as EmployerLayoutBase } from './employer/EmployerLayout';
import { withRBAC } from './withRBAC';

/** Admin dashboard shell — admin role required. */
export const ProtectedAdminLayout = withRBAC(AdminLayoutBase, {
  allowedRoles: ['admin'],
});

/** Employer dashboard shell — employer role required. */
export const ProtectedEmployerLayout = withRBAC(EmployerLayoutBase, {
  allowedRoles: ['employer'],
});
