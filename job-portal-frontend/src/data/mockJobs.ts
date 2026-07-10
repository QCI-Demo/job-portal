import type { Job } from '../types/job'

/** Sample listings used when the API is unavailable (hi-fi prototype / local demo). */
export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    description:
      'Build accessible, high-performance candidate experiences for our job portal. You will own React components, design-system integration, and Core Web Vitals on mobile networks.',
    requirements:
      '5+ years React/TypeScript\nStrong WCAG 2.1 AA practice\nExperience with Vite or similar tooling\nComfortable collaborating with design and BA partners',
    location: 'Remote — US',
    category: 'engineering',
    company: { id: 'co-1', name: 'Northwind Labs' },
    featured: true,
    employmentType: 'Full-time',
    postedAt: '2026-07-01',
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    description:
      'Shape end-to-end flows for Home, Search, Apply, and Profile. Partner with engineering to ship responsive layouts that meet WCAG AA and load under two seconds on typical mobile connections.',
    requirements:
      'Portfolio of shipped product UI\nFigma proficiency\nExperience with design systems\nFamiliarity with accessibility audits',
    location: 'New York, NY',
    category: 'design',
    company: { id: 'co-2', name: 'Harbor Talent' },
    featured: true,
    employmentType: 'Full-time',
    postedAt: '2026-07-03',
  },
  {
    id: 'job-3',
    title: 'Growth Marketing Manager',
    description:
      'Drive candidate acquisition for the public job portal. Own landing experiments, SEO for job listings, and lifecycle messaging that converts browsers into applicants.',
    requirements:
      '3+ years B2C or marketplace marketing\nA/B testing experience\nStrong copywriting\nAnalytics fluency (GA4 or similar)',
    location: 'Austin, TX',
    category: 'marketing',
    company: { id: 'co-3', name: 'BrightPath Careers' },
    featured: true,
    employmentType: 'Full-time',
    postedAt: '2026-06-28',
  },
  {
    id: 'job-4',
    title: 'Account Executive — Employer Sales',
    description:
      'Help employers post roles and grow their hiring pipeline. You will demo the portal, negotiate plans, and partner with customer success after close.',
    requirements:
      '2+ years SaaS or recruiting sales\nComfortable with discovery calls\nCRM experience\nClear written communication',
    location: 'Chicago, IL',
    category: 'sales',
    company: { id: 'co-4', name: 'Summit Hire' },
    featured: false,
    employmentType: 'Full-time',
    postedAt: '2026-07-05',
  },
  {
    id: 'job-5',
    title: 'People Operations Specialist',
    description:
      'Support recruiting operations across the portal: job intake, compliance checks, and candidate experience improvements with the product team.',
    requirements:
      'HR or recruiting ops background\nAttention to detail\nComfort with spreadsheets and ticketing tools\nEmpathetic candidate communication',
    location: 'Remote — EU',
    category: 'hr',
    company: { id: 'co-2', name: 'Harbor Talent' },
    featured: false,
    employmentType: 'Contract',
    postedAt: '2026-06-20',
  },
  {
    id: 'job-6',
    title: 'Backend Engineer (Go)',
    description:
      'Design and implement APIs for jobs, applications, and auth. Prefer Gin-based services, clear contracts, and observability that keeps the UI under the 2s mobile load target.',
    requirements:
      '3+ years Go\nREST API design\nPostgreSQL experience\nFamiliarity with containerized deployments',
    location: 'Seattle, WA',
    category: 'engineering',
    company: { id: 'co-1', name: 'Northwind Labs' },
    featured: true,
    employmentType: 'Full-time',
    postedAt: '2026-07-07',
  },
  {
    id: 'job-7',
    title: 'Operations Coordinator',
    description:
      'Keep employer onboarding and job moderation running smoothly. Coordinate between support, compliance, and engineering when listings need review.',
    requirements:
      '1+ year operations or support role\nStrong prioritization skills\nClear escalation judgment\nWillingness to document playbooks',
    location: 'Boston, MA',
    category: 'operations',
    company: { id: 'co-3', name: 'BrightPath Careers' },
    featured: false,
    employmentType: 'Part-time',
    postedAt: '2026-06-15',
  },
  {
    id: 'job-8',
    title: 'UX Researcher',
    description:
      'Run moderated studies on search, apply, and profile flows. Translate findings into actionable recommendations for design and engineering.',
    requirements:
      'Mixed-methods research experience\nRecruiting and interviewing skills\nClear synthesis writing\nAccessibility awareness',
    location: 'Remote — US',
    category: 'design',
    company: { id: 'co-4', name: 'Summit Hire' },
    featured: false,
    employmentType: 'Full-time',
    postedAt: '2026-07-02',
  },
]

export function filterMockJobs(params: {
  location?: string
  category?: string
  q?: string
  type?: string
  featured?: boolean
}): Job[] {
  const location = params.location?.trim().toLowerCase()
  const category = params.category?.trim().toLowerCase()
  const q = params.q?.trim().toLowerCase()
  const type = params.type?.trim().toLowerCase()

  return MOCK_JOBS.filter((job) => {
    if (params.featured && !job.featured) return false
    if (location && !job.location.toLowerCase().includes(location)) return false
    if (category && job.category.toLowerCase() !== category) return false
    if (type && (job.employmentType ?? '').toLowerCase() !== type) return false
    if (q) {
      const haystack = `${job.title} ${job.description} ${typeof job.company === 'string' ? job.company : job.company.name}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function getMockJobById(id: string): Job | undefined {
  return MOCK_JOBS.find((job) => job.id === id)
}
