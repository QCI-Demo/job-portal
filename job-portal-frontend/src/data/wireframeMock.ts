/** Static mock data for admin & employer dashboard wireframe prototypes. */

export const adminKpis = [
  { id: 'users', label: 'Total users', value: '12,480', delta: '+4.2%', href: '/admin/users' },
  { id: 'jobs', label: 'Active jobs', value: '1,024', delta: '+1.8%', href: '/admin/jobs' },
  { id: 'pending', label: 'Pending moderation', value: '37', delta: '-6', href: '/admin/jobs?status=PENDING' },
  { id: 'apps', label: 'New applications (7d)', value: '892', delta: '+12%', href: '/admin' },
]

export const adminUsers = [
  { id: 'u1', name: 'Ava Chen', email: 'ava.chen@example.com', roles: 'admin', status: 'Active', joined: '2025-01-12' },
  { id: 'u2', name: 'Marcus Lee', email: 'marcus@northwind.io', roles: 'employer', status: 'Active', joined: '2025-03-04' },
  { id: 'u3', name: 'Priya Shah', email: 'priya.shah@mail.com', roles: 'candidate', status: 'Active', joined: '2025-06-18' },
  { id: 'u4', name: 'Jordan Blake', email: 'j.blake@acme.co', roles: 'employer', status: 'Suspended', joined: '2024-11-02' },
  { id: 'u5', name: 'Sam Rivera', email: 'sam.r@example.com', roles: 'candidate', status: 'Active', joined: '2026-02-21' },
]

export const adminJobs = [
  { id: 'j1', title: 'Senior React Engineer', company: 'Northwind', category: 'Engineering', status: 'PENDING', submitted: '2026-07-08' },
  { id: 'j2', title: 'Product Designer', company: 'Acme Co', category: 'Design', status: 'PUBLISHED', submitted: '2026-07-05' },
  { id: 'j3', title: 'Data Analyst', company: 'Helix Labs', category: 'Analytics', status: 'PENDING', submitted: '2026-07-09' },
  { id: 'j4', title: 'Customer Success Lead', company: 'BrightPath', category: 'Support', status: 'REJECTED', submitted: '2026-07-01' },
  { id: 'j5', title: 'DevOps Engineer', company: 'Cloudspan', category: 'Engineering', status: 'CLOSED', submitted: '2026-06-20' },
]

export const adminCategories = [
  { id: 'c1', name: 'Engineering', slug: 'engineering', jobs: 412, active: true },
  { id: 'c2', name: 'Design', slug: 'design', jobs: 128, active: true },
  { id: 'c3', name: 'Analytics', slug: 'analytics', jobs: 96, active: true },
  { id: 'c4', name: 'Support', slug: 'support', jobs: 74, active: true },
  { id: 'c5', name: 'Operations', slug: 'operations', jobs: 0, active: false },
]

export const adminActivity = [
  { id: 'a1', type: 'Job', subject: 'Senior React Engineer', submitted: '2h ago' },
  { id: 'a2', type: 'User', subject: 'Jordan Blake suspended', submitted: '5h ago' },
  { id: 'a3', type: 'Job', subject: 'Data Analyst', submitted: '1d ago' },
  { id: 'a4', type: 'Category', subject: 'Operations deactivated', submitted: '2d ago' },
]

export const employerJobs = [
  { id: 'ej1', title: 'Frontend Developer', location: 'Remote', status: 'PUBLISHED', applications: 24, updated: '2026-07-08' },
  { id: 'ej2', title: 'UX Researcher', location: 'Austin, TX', status: 'DRAFT', applications: 0, updated: '2026-07-07' },
  { id: 'ej3', title: 'Platform Engineer', location: 'New York, NY', status: 'PUBLISHED', applications: 11, updated: '2026-07-02' },
  { id: 'ej4', title: 'Support Specialist', location: 'Remote', status: 'CLOSED', applications: 48, updated: '2026-06-15' },
]

export const employerApplications = [
  {
    id: 'ap1',
    candidate: 'Priya Shah',
    email: 'priya.shah@mail.com',
    jobId: 'ej1',
    jobTitle: 'Frontend Developer',
    status: 'SUBMITTED',
    applied: '2026-07-09',
    resume: 'priya-shah-resume.pdf',
    coverLetter:
      'I have 5 years of React experience and recently led a design-system migration at my current company.',
  },
  {
    id: 'ap2',
    candidate: 'Sam Rivera',
    email: 'sam.r@example.com',
    jobId: 'ej1',
    jobTitle: 'Frontend Developer',
    status: 'IN_REVIEW',
    applied: '2026-07-08',
    resume: 'sam-rivera-cv.pdf',
    coverLetter: 'Excited about your product and the remote-first culture.',
  },
  {
    id: 'ap3',
    candidate: 'Alex Kim',
    email: 'alex.kim@mail.com',
    jobId: 'ej3',
    jobTitle: 'Platform Engineer',
    status: 'SHORTLISTED',
    applied: '2026-07-06',
    resume: 'alex-kim.pdf',
    coverLetter: 'Kubernetes and Terraform are my day-to-day tools.',
  },
  {
    id: 'ap4',
    candidate: 'Taylor Brooks',
    email: 't.brooks@mail.com',
    jobId: 'ej3',
    jobTitle: 'Platform Engineer',
    status: 'REJECTED',
    applied: '2026-07-03',
    resume: 'taylor-brooks.pdf',
    coverLetter: 'Looking to move into platform engineering full time.',
  },
]

export const employerKpis = [
  { id: 'open', label: 'Open jobs', value: '2', href: '/employer/jobs?status=PUBLISHED' },
  { id: 'drafts', label: 'Drafts', value: '1', href: '/employer/jobs?status=DRAFT' },
  { id: 'apps', label: 'Applications', value: '83', href: '/employer/applications' },
  { id: 'new', label: 'New this week', value: '9', href: '/employer/applications?status=SUBMITTED' },
]
