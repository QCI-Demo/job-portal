import { useEffect, useState } from 'react'
import { ChartContainer } from '@jobportal/dashboard-ui'
import { getAdminAnalytics } from '../../api/admin/analytics'
import type { AdminAnalytics } from '../../types/admin'
import { ApiError } from '../../api/client'

function MetricDisplay({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="admin-metric">
      <div className="admin-metric__value">{value}</div>
      <div className="admin-metric__label">{label}</div>
    </div>
  )
}

function healthClass(status: AdminAnalytics['systemHealth']['status']): string {
  return `admin-health-badge admin-health-badge--${status}`
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAnalytics() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAdminAnalytics()
        if (!cancelled) {
          setAnalytics(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load analytics'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadAnalytics()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Analytics</h1>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="admin-analytics-grid">
        <ChartContainer title="Job Count" subtitle="Total published jobs" isLoading={loading} height={180}>
          <MetricDisplay value={analytics?.jobCount ?? 0} label="Jobs" />
        </ChartContainer>

        <ChartContainer
          title="Applications"
          subtitle="Total applications received"
          isLoading={loading}
          height={180}
        >
          <MetricDisplay value={analytics?.applicationsCount ?? 0} label="Applications" />
        </ChartContainer>

        <ChartContainer title="Active Users" subtitle="Users active in the last 30 days" isLoading={loading} height={180}>
          <MetricDisplay value={analytics?.activeUsers ?? 0} label="Active Users" />
        </ChartContainer>

        <ChartContainer title="System Health" subtitle="Platform status overview" isLoading={loading} height={220}>
          {analytics ? (
            <div className="admin-metric">
              <span className={healthClass(analytics.systemHealth.status)}>
                {analytics.systemHealth.status}
              </span>
              <div className="admin-metric__value" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                {analytics.systemHealth.uptimePercent}%
              </div>
              <div className="admin-metric__label">Uptime</div>
              <div className="admin-metric__label" style={{ marginTop: '0.75rem' }}>
                Avg latency: {analytics.systemHealth.latencyMs}ms
              </div>
            </div>
          ) : (
            <MetricDisplay value="—" label="No data" />
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
