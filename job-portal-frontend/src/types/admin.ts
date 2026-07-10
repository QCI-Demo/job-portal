export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type AdminUserRole = 'admin' | 'employer' | 'candidate';

export interface AdminUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  roles: AdminUserRole[];
  status: AdminUserStatus;
  createdAt?: string;
  joined?: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password?: string;
  roles: AdminUserRole[];
  status?: AdminUserStatus;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  roles?: AdminUserRole[];
  status?: AdminUserStatus;
}

export type AdminJobStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'CLOSED' | 'DRAFT';

export interface AdminJob extends Record<string, unknown> {
  id: string;
  title: string;
  company: string;
  category?: string;
  location?: string;
  description?: string;
  status: AdminJobStatus;
  submittedAt?: string;
  submitted?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAdminJobPayload {
  title?: string;
  company?: string;
  category?: string;
  location?: string;
  description?: string;
  status?: AdminJobStatus;
}

export interface AdminCategory extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  jobCount?: number;
  jobs?: number;
  active: boolean;
}

export interface CreateAdminCategoryPayload {
  name: string;
  slug: string;
  active?: boolean;
}

export interface UpdateAdminCategoryPayload {
  name?: string;
  slug?: string;
  active?: boolean;
}

export interface AdminSettings {
  general: {
    siteName: string;
    supportEmail: string;
    allowPublicRegistration: boolean;
  };
  email: {
    fromAddress: string;
    smtpHost: string;
  };
  moderation: {
    requireApproval: boolean;
    autoFlagKeywords: string[];
  };
}

export interface AdminAnalyticsKpis {
  jobCount: number;
  applicationsCount: number;
  activeUsers: number;
  systemHealth?: number | string;
  pendingModeration?: number;
  deltas?: {
    jobs?: string;
    applications?: string;
    users?: string;
    health?: string;
  };
}

export interface AdminAnalyticsSeriesPoint {
  label: string;
  value: number;
}

export interface AdminAnalytics {
  kpis: AdminAnalyticsKpis;
  jobsOverTime?: AdminAnalyticsSeriesPoint[];
  applicationsOverTime?: AdminAnalyticsSeriesPoint[];
  jobsByStatus?: AdminAnalyticsSeriesPoint[];
  activeUsersOverTime?: AdminAnalyticsSeriesPoint[];
  systemHealth?: {
    status: string;
    uptimePercent?: number;
    metrics?: AdminAnalyticsSeriesPoint[];
  };
  recentActivity?: Array<{
    id: string;
    type: string;
    subject: string;
    submittedAt?: string;
  }>;
}

export interface PaginatedAdminResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
