import { useEffect, useMemo, useState } from 'react';
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui';
import { deleteAdminJob, getAdminJobs, updateAdminJob } from '../../api/admin/jobs';
import { ApiError } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { AdminJob, AdminJobStatus } from '../../types/admin';

interface JobFormState {
  title: string;
  company: string;
  category: string;
  location: string;
  description: string;
  status: AdminJobStatus;
}

const emptyForm: JobFormState = {
  title: '',
  company: '',
  category: '',
  location: '',
  description: '',
  status: 'PENDING',
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase();
}

function statusBadgeClass(status: string): string {
  return `admin-status-badge admin-status-badge--${status.toLowerCase()}`;
}

function normalizeJob(job: AdminJob): AdminJob {
  return {
    ...job,
    status: (String(job.status || 'PENDING').toUpperCase() as AdminJobStatus) || 'PENDING',
  };
}

export function JobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null);
  const [deactivatingJob, setDeactivatingJob] = useState<AdminJob | null>(null);
  const [form, setForm] = useState<JobFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof JobFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminJobs();
        if (!cancelled) {
          setJobs(data.map(normalizeJob));
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

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (statusFilter && job.status !== statusFilter) return false;
      if (!query) return true;
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        String(job.category ?? '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [jobs, statusFilter, search]);

  const openEdit = (job: AdminJob) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      company: job.company,
      category: job.category ?? '',
      location: job.location ?? '',
      description: job.description ?? '',
      status: job.status,
    });
    setFormErrors({});
    setEditOpen(true);
  };

  const applyOptimisticStatus = async (
    job: AdminJob,
    status: AdminJobStatus,
    successMessage: string,
  ) => {
    const previous = jobs;
    setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, status } : item)));

    try {
      const updated = normalizeJob(await updateAdminJob(job.id, { status }));
      setJobs((current) => current.map((item) => (item.id === job.id ? updated : item)));
      showToast(successMessage);
    } catch (err) {
      setJobs(previous);
      const message = err instanceof ApiError ? err.message : `Failed to update job status`;
      showToast(message, 'error');
    }
  };

  const handleSave = async () => {
    if (!editingJob) return;

    const nextErrors: Partial<Record<keyof JobFormState, string>> = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.company.trim()) nextErrors.company = 'Company is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const previous = jobs;
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      category: form.category.trim() || undefined,
      location: form.location.trim() || undefined,
      description: form.description.trim() || undefined,
      status: form.status,
    };

    setJobs((current) =>
      current.map((item) => (item.id === editingJob.id ? { ...item, ...payload } : item)),
    );
    setEditOpen(false);

    try {
      const updated = normalizeJob(await updateAdminJob(editingJob.id, payload));
      setJobs((current) => current.map((item) => (item.id === editingJob.id ? updated : item)));
      showToast('Job updated successfully');
    } catch (err) {
      setJobs(previous);
      const message = err instanceof ApiError ? err.message : 'Failed to update job';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingJob) return;

    const previous = jobs;
    const targetId = deactivatingJob.id;
    setJobs((current) =>
      current.map((item) => (item.id === targetId ? { ...item, status: 'CLOSED' as const } : item)),
    );
    setConfirmOpen(false);
    setDeactivatingJob(null);

    try {
      await deleteAdminJob(targetId);
      showToast('Job deactivated successfully');
    } catch (err) {
      setJobs(previous);
      const message = err instanceof ApiError ? err.message : 'Failed to deactivate job';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Job moderation</h1>
          <p className="admin-page__subtitle">
            Review employer postings — approve, reject, edit, or deactivate.
          </p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-filter-field" style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="admin-job-search">Search</label>
          <input
            id="admin-job-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title or company"
          />
        </div>
        <div className="admin-filter-field">
          <label htmlFor="admin-job-status">Status</label>
          <select
            id="admin-job-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'company', header: 'Company' },
          {
            key: 'category',
            header: 'Category',
            render: (row) => String(row.category ?? '—'),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={statusBadgeClass(String(row.status))}>
                {formatStatus(String(row.status))}
              </span>
            ),
          },
          {
            key: 'submittedAt',
            header: 'Submitted',
            render: (row) => String(row.submittedAt ?? row.submitted ?? row.createdAt ?? '—'),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => {
              const job = row as AdminJob;
              return (
                <div className="admin-page__actions">
                  {job.status === 'PENDING' ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          void applyOptimisticStatus(job, 'PUBLISHED', 'Job approved');
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          void applyOptimisticStatus(job, 'REJECTED', 'Job rejected');
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  ) : null}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      openEdit(job);
                    }}
                  >
                    Edit
                  </Button>
                  {job.status !== 'CLOSED' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeactivatingJob(job);
                        setConfirmOpen(true);
                      }}
                    >
                      Deactivate
                    </Button>
                  ) : null}
                </div>
              );
            },
          },
        ]}
        data={filteredJobs}
        isLoading={loading}
        emptyMessage="No jobs in the moderation queue."
      />

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit job"
        size="lg"
        footer={
          <div className="admin-page__actions">
            <Button variant="secondary" onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSave()} isLoading={submitting}>
              Save changes
            </Button>
          </div>
        }
      >
        <div className="admin-form-grid">
          <FormInput
            label="Title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            error={formErrors.title}
            required
          />
          <FormInput
            label="Company"
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
            error={formErrors.company}
            required
          />
          <FormInput
            label="Category"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
          />
          <FormInput
            label="Location"
            value={form.location}
            onChange={(event) =>
              setForm((current) => ({ ...current, location: event.target.value }))
            }
          />
          <div className="admin-form-select">
            <label htmlFor="admin-job-form-status">Status</label>
            <select
              id="admin-job-form-status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as AdminJobStatus,
                }))
              }
            >
              <option value="PENDING">Pending</option>
              <option value="PUBLISHED">Published</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          <div className="admin-form-textarea">
            <label htmlFor="admin-job-description">Description</label>
            <textarea
              id="admin-job-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeactivatingJob(null);
        }}
        title="Deactivate job?"
        size="sm"
        footer={
          <div className="admin-page__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                setDeactivatingJob(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleDeactivate()}>
              Deactivate
            </Button>
          </div>
        }
      >
        <p>
          {deactivatingJob
            ? `"${deactivatingJob.title}" will be removed from active listings.`
            : 'This job will be deactivated.'}
        </p>
      </Modal>
    </div>
  );
}
