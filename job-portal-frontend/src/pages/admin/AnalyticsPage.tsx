import { useEffect, useMemo, useState } from 'react';
import { ChartContainer, DataTable } from '@jobportal/dashboard-ui';
import { getAdminAnalytics } from '../../api/admin/analytics';
import { ApiError } from '../../api/client';
import type { AdminAnalytics, AdminAnalyticsSeriesPoint } from '../../types/admin';

function MetricBars({
  points,
  emptyMessage = 'No data available',
}: {
  points: AdminAnalyticsSeriesPoint[];
  emptyMessage?: string;
}) {
  if (points.length === 0) {
    return <p className="admin-page__subtitle">{emptyMessage}</p>;
  }

  const max = Math.max(...points.map((point) => point.value), 1);

  return (
    <div className="admin-metric-bars" role="img" aria-label="Metric bar chart">
      {points.map((point) => (
        <div key={point.label} className="admin-metric-bar">
          <span className="admin-metric-bar__label">{point.label}</span>
          <div className="admin-metric-bar__track">
            <div
              className="admin-metric-bar__fill"
              style={{ width: `${Math.max((point.value / max) * 100, 2)}%` }}
            />
          </div>
          <span className="admin-metric-bar__value">{point.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatNumber(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat().format(value);
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminAnalytics();
        if (!cancelled) {
          setAnalytics(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load analytics';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = useMemo(() => {
    const data = analytics?.kpis;
    return [
      {
        id: 'jobs',
        label: 'Job count',
        value: formatNumber(data?.jobCount),
        delta: data?.deltas?.jobs,
      },
      {
        id: 'applications',
        label: 'Applications count',
        value: formatNumber(data?.applicationsCount),
        delta: data?.deltas?.applications,
      },
      {
        id: 'users',
        label: 'Active users',
        value: formatNumber(data?.activeUsers),
        delta: data?.deltas?.users,
      },
      {
        id: 'health',
        label: 'System health',
        value:
          data?.systemHealth == null
            ? analytics?.systemHealth?.uptimePercent != null
              ? `${analytics.systemHealth.uptimePercent}%`
              : (analytics?.systemHealth?.status ?? '—')
            : typeof data.systemHealth === 'number'
              ? `${data.systemHealth}%`
              : String(data.systemHealth),
        delta: data?.deltas?.health,
      },
    ];
  }, [analytics]);

  const jobsSeries = analytics?.jobsOverTime ?? analytics?.jobsByStatus ?? [];
  const applicationsSeries = analytics?.applicationsOverTime ?? [];
  const usersSeries = analytics?.activeUsersOverTime ?? [];
  const healthSeries = analytics?.systemHealth?.metrics ?? [];
  const healthStatus = analytics?.systemHealth?.status ?? 'unknown';

  const activityRows = (analytics?.recentActivity ?? []).map((item) => ({
    ...item,
  }));

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Analytics</h1>
          <p className="admin-page__subtitle">
            Job volume, applications, active users, and system health.
          </p>
        </div>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <section className="admin-analytics-grid" aria-label="KPI cards">
        {kpis.map((kpi) => (
          <article key={kpi.id} className="admin-kpi-card">
            <p className="admin-kpi-card__label">{kpi.label}</p>
            <p className="admin-kpi-card__value">{loading ? '…' : kpi.value}</p>
            {kpi.delta ? <p className="admin-kpi-card__delta">{kpi.delta}</p> : null}
          </article>
        ))}
      </section>

      <section className="admin-analytics-charts" aria-label="Analytics charts">
        <ChartContainer title="Job count" subtitle="Jobs over time / by status" isLoading={loading}>
          <MetricBars points={jobsSeries} emptyMessage="No job metrics available." />
        </ChartContainer>

        <ChartContainer
          title="Applications count"
          subtitle="Applications over time"
          isLoading={loading}
        >
          <MetricBars
            points={applicationsSeries}
            emptyMessage="No application metrics available."
          />
        </ChartContainer>

        <ChartContainer title="Active users" subtitle="Active users over time" isLoading={loading}>
          <MetricBars points={usersSeries} emptyMessage="No active user metrics available." />
        </ChartContainer>

        <ChartContainer
          title="System health"
          subtitle="Platform health metrics"
          isLoading={loading}
        >
          <div className="admin-health-panel">
            <p
              className={`admin-health-panel__status admin-health-panel__status--${healthStatus.toLowerCase()}`}
            >
              {healthStatus}
            </p>
            {analytics?.systemHealth?.uptimePercent != null ? (
              <p className="admin-page__subtitle">
                Uptime: {analytics.systemHealth.uptimePercent}%
              </p>
            ) : null}
            <MetricBars points={healthSeries} emptyMessage="No health metrics available." />
          </div>
        </ChartContainer>
      </section>

      {activityRows.length > 0 ? (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 className="admin-page__title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            Recent activity
          </h2>
          <DataTable
            columns={[
              { key: 'type', header: 'Type' },
              { key: 'subject', header: 'Subject' },
              {
                key: 'submittedAt',
                header: 'Submitted',
                render: (row) => String(row.submittedAt ?? '—'),
              },
            ]}
            data={activityRows}
            isLoading={loading}
            emptyMessage="No recent activity."
          />
        </section>
      ) : null}
    </div>
  );
}
