import { useEffect, useState } from 'react';
import { Button, DataTable, Modal } from '@jobportal/dashboard-ui';
import { getEmployerApplications } from '../../api/employer/applications';
import { getEmployerJobs } from '../../api/employer/jobs';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../api/client';
import {
  APPLICATION_STATUS_OPTIONS,
  type ApplicationStatus,
  type EmployerApplication,
  type EmployerJob,
} from '../../types/employer';

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase();
}

function statusBadgeClass(status: string): string {
  return `employer-status-badge employer-status-badge--${status.toLowerCase()}`;
}

export function ApplicationsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<EmployerApplication | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const data = await getEmployerJobs();
        if (!cancelled) {
          setJobs(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load jobs';
          showToast(message, 'error');
        }
      }
    }

    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEmployerApplications({
          jobId: selectedJobId || undefined,
          status: statusFilter,
        });
        if (!cancelled) {
          setApplications(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load applications';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadApplications();
    return () => {
      cancelled = true;
    };
  }, [selectedJobId, statusFilter]);

  return (
    <div>
      <div className="employer-page__header">
        <h1 className="employer-page__title">Applications</h1>
      </div>

      <div className="employer-filters">
        <div className="employer-filter-field">
          <label htmlFor="job-filter">Job</label>
          <select
            id="job-filter"
            value={selectedJobId}
            onChange={(event) => setSelectedJobId(event.target.value)}
          >
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div className="employer-filter-field">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ApplicationStatus | '')}
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="employer-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: 'applicantName', header: 'Applicant' },
          { key: 'jobTitle', header: 'Job' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={statusBadgeClass(String(row.status))}>
                {formatStatus(String(row.status))}
              </span>
            ),
          },
          { key: 'appliedAt', header: 'Applied' },
        ]}
        data={applications}
        isLoading={loading}
        emptyMessage="No applications found for the selected filters."
        onRowClick={(row) => setSelectedApplication(row as EmployerApplication)}
      />

      <Modal
        isOpen={selectedApplication !== null}
        onClose={() => setSelectedApplication(null)}
        title="Application Details"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setSelectedApplication(null)}>
            Close
          </Button>
        }
      >
        {selectedApplication ? (
          <dl className="employer-detail-grid">
            <div className="employer-detail-row">
              <dt>Applicant</dt>
              <dd>{selectedApplication.applicantName}</dd>
            </div>
            <div className="employer-detail-row">
              <dt>Email</dt>
              <dd>{selectedApplication.applicantEmail}</dd>
            </div>
            <div className="employer-detail-row">
              <dt>Job</dt>
              <dd>{selectedApplication.jobTitle ?? selectedApplication.jobId}</dd>
            </div>
            <div className="employer-detail-row">
              <dt>Status</dt>
              <dd>
                <span className={statusBadgeClass(selectedApplication.status)}>
                  {formatStatus(selectedApplication.status)}
                </span>
              </dd>
            </div>
            <div className="employer-detail-row">
              <dt>Applied</dt>
              <dd>{selectedApplication.appliedAt}</dd>
            </div>
            {selectedApplication.coverLetter ? (
              <div className="employer-detail-row">
                <dt>Cover Letter</dt>
                <dd className="employer-detail-cover-letter">{selectedApplication.coverLetter}</dd>
              </div>
            ) : null}
            {selectedApplication.resumeUrl ? (
              <div className="employer-detail-row">
                <dt>Resume</dt>
                <dd>
                  <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View resume
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}
