import { DashboardShell } from '../wireframe/DashboardShell'

const adminNav = [
  { label: 'Overview', to: '/admin', end: true, interactionId: 'admin.nav.overview' },
  { label: 'Users', to: '/admin/users', interactionId: 'admin.nav.users' },
  { label: 'Jobs', to: '/admin/jobs', interactionId: 'admin.nav.jobs' },
  { label: 'Categories', to: '/admin/categories', interactionId: 'admin.nav.categories' },
  { label: 'Settings', to: '/admin/settings', interactionId: 'admin.nav.settings' },
]

export function AdminWireframeLayout() {
  return (
    <DashboardShell
      brand="JobPortal Admin"
      roleLabel="Admin wireframes"
      homeTo="/admin"
      navItems={adminNav}
      userName="Admin Reviewer"
    />
  )
}
