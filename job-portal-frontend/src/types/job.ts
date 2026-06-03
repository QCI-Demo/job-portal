export interface Company {
  id: string
  name: string
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  category: string
  company: Company | string
  featured?: boolean
}

export interface JobsListResponse {
  jobs: Job[]
  total?: number
}

export function getCompanyName(company: Job['company']): string {
  return typeof company === 'string' ? company : company.name
}
