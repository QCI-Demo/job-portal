import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, DataTable } from '@jobportal/dashboard-ui';
import { deactivateEmployerJob, getEmployerJobs } from '../../api/employer/jobs';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../api/client';
import type { EmployerJob } from '../../types/employer';

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase();
}

function statusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'published') return 'employer-status-badge--published';
  if (normalized === 'draft') return 'employer-status-badge--draft';
  if (normalized === 'closed' || normalized === 'archived') {
    return 'employer-status-badge--closed';
  }
  return 'employer-status-badge--draft';
}

export function JobListPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEmployerJobs();
        if (!cancelled) {
          setJobs(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load jobs';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeactivate = async (job: EmployerJob) => {
    const previous = jobs;
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? { ...item, status: 'CLOSED' as const } : item)),
    );

    try {
      const updated = await deactivateEmployerJob(job.id);
      setJobs((current) => current.map((item) => (item.id === job.id ? updated : item)));
      showToast('Job deactivated successfully');
    } catch (err) {
      setJobs(previous);
      const message = err instanceof ApiError ? err.message : 'Failed to deactivate job';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <div className="employer-page__header">
        <h1 className="employer-page__title">My Jobs</h1>
        <Link to="/jobs/new">
          <Button variant="primary">Post a Job</Button>
        </Link>
      </div>

      {error ? (
        <div className="employer-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'location', header: 'Location' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={`employer-status-badge ${statusBadgeClass(String(row.status))}`}>
                {formatStatus(String(row.status))}
              </span>
            ),
          },
          { key: 'createdAt', header: 'Created' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="employer-page__actions">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/jobs/${String(row.id)}/edit`);
                  }}
                >
                  Edit
                </Button>
                {row.status === 'PUBLISHED' || row.status === 'DRAFT' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleDeactivate(row as EmployerJob);
                    }}
                  >
                    Deactivate
                  </Button>
                ) : null}
              </div>
            ),
          },
        ]}
        data={jobs}
        isLoading={loading}
        emptyMessage="No jobs posted yet. Create your first job listing."
      />
    </div>
  );
}
