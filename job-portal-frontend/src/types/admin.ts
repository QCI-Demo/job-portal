export type UserStatus = 'active' | 'inactive'

export interface AdminUser extends Record<string, unknown> {
  id: string
  name: string
  email: string
  roles: string[]
  status: UserStatus
  createdAt: string
}

export interface CreateAdminUserPayload {
  name: string
  email: string
  password: string
  roles: string[]
}

export interface UpdateAdminUserPayload {
  name?: string
  email?: string
  roles?: string[]
  status?: UserStatus
}

export type JobModerationStatus = 'pending' | 'approved' | 'rejected' | 'inactive'

export interface AdminJob extends Record<string, unknown> {
  id: string
  title: string
  employerName: string
  status: JobModerationStatus
  category?: string
  location?: string
  createdAt: string
}

export interface UpdateAdminJobPayload {
  title?: string
  status?: JobModerationStatus
  category?: string
  location?: string
}

export interface AdminCategory extends Record<string, unknown> {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  description?: string
  isActive?: boolean
}

export interface UpdateCategoryPayload {
  name?: string
  slug?: string
  description?: string
  isActive?: boolean
}

export interface SiteSettings {
  siteName: string
  supportEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  maxApplicationsPerJob: number
}

export type SystemHealthStatus = 'healthy' | 'degraded' | 'down'

export interface AdminAnalytics {
  jobCount: number
  applicationsCount: number
  activeUsers: number
  systemHealth: {
    status: SystemHealthStatus
    uptimePercent: number
    latencyMs: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
