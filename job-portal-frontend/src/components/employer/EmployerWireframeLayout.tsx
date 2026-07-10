import { DashboardShell } from '../wireframe/DashboardShell'

const employerNav = [
  { label: 'Overview', to: '/employer', end: true, interactionId: 'employer.nav.overview' },
  { label: 'My Jobs', to: '/employer/jobs', end: true, interactionId: 'employer.nav.jobs' },
  { label: 'Post a Job', to: '/employer/jobs/new', interactionId: 'employer.nav.post' },
  { label: 'Applications', to: '/employer/applications', end: true, interactionId: 'employer.nav.applications' },
]

export function EmployerWireframeLayout() {
  return (
    <DashboardShell
      brand="JobPortal Employer"
      roleLabel="Employer wireframes"
      homeTo="/employer"
      navItems={employerNav}
      userName="Employer Reviewer"
    />
  )
}
