import { DashboardShell } from '../wireframe/DashboardShell';

const adminNav = [
  { label: 'Overview', to: '/wireframes/admin', end: true, interactionId: 'admin.nav.overview' },
  { label: 'Users', to: '/wireframes/admin/users', interactionId: 'admin.nav.users' },
  { label: 'Jobs', to: '/wireframes/admin/jobs', interactionId: 'admin.nav.jobs' },
  {
    label: 'Categories',
    to: '/wireframes/admin/categories',
    interactionId: 'admin.nav.categories',
  },
  { label: 'Settings', to: '/wireframes/admin/settings', interactionId: 'admin.nav.settings' },
];

export function AdminWireframeLayout() {
  return (
    <DashboardShell
      brand="JobPortal Admin"
      roleLabel="Admin wireframes"
      homeTo="/wireframes/admin"
      navItems={adminNav}
      userName="Admin Reviewer"
    />
  );
}
