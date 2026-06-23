import { useEffect, useState } from 'react'
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui'
import { deleteAdminJob, getAdminJobs, updateAdminJob } from '../../api/admin/jobs'
import { useToast } from '../../context/ToastContext'
import type { AdminJob, JobModerationStatus } from '../../types/admin'
import { ApiError } from '../../api/client'

export function JobManagementPage() {
  const { showToast } = useToast()
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', location: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadJobs() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAdminJobs()
        if (!cancelled) {
          setJobs(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load jobs'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadJobs()
    return () => {
      cancelled = true
    }
  }, [])

  const updateJobStatus = async (job: AdminJob, status: JobModerationStatus, successMessage: string) => {
    const previous = jobs
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? { ...item, status } : item)),
    )

    try {
      const updated = await updateAdminJob(job.id, { status })
      setJobs((current) => current.map((item) => (item.id === job.id ? updated : item)))
      showToast(successMessage)
    } catch (err) {
      setJobs(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to update job'
      showToast(message, 'error')
    }
  }

  const openEditModal = (job: AdminJob) => {
    setEditingJob(job)
    setForm({
      title: job.title,
      category: job.category ?? '',
      location: job.location ?? '',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingJob(null)
  }

  const handleSaveEdit = async () => {
    if (!editingJob) return

    const previous = jobs
    const optimisticJob: AdminJob = {
      ...editingJob,
      title: form.title,
      category: form.category,
      location: form.location,
    }

    setJobs((current) =>
      current.map((item) => (item.id === editingJob.id ? optimisticJob : item)),
    )
    closeModal()
    setSubmitting(true)

    try {
      const updated = await updateAdminJob(editingJob.id, {
        title: form.title,
        category: form.category,
        location: form.location,
      })
      setJobs((current) => current.map((item) => (item.id === editingJob.id ? updated : item)))
      showToast('Job updated successfully')
    } catch (err) {
      setJobs(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to update job'
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (job: AdminJob) => {
    await updateJobStatus(job, 'inactive', 'Job deactivated')
  }

  const handleDelete = async (job: AdminJob) => {
    const previous = jobs
    setJobs((current) => current.filter((item) => item.id !== job.id))

    try {
      await deleteAdminJob(job.id)
      showToast('Job deleted successfully')
    } catch (err) {
      setJobs(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to delete job'
      showToast(message, 'error')
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Job Management</h1>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'employerName', header: 'Employer' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span
                className={`admin-health-badge admin-health-badge--${
                  row.status === 'approved'
                    ? 'healthy'
                    : row.status === 'pending'
                      ? 'degraded'
                      : 'down'
                }`}
              >
                {String(row.status)}
              </span>
            ),
          },
          { key: 'createdAt', header: 'Created' },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="admin-page__actions">
                {row.status === 'pending' ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => void updateJobStatus(row, 'approved', 'Job approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void updateJobStatus(row, 'rejected', 'Job rejected')}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                <Button size="sm" variant="secondary" onClick={() => openEditModal(row)}>
                  Edit
                </Button>
                {row.status !== 'inactive' ? (
                  <Button size="sm" variant="danger" onClick={() => void handleDeactivate(row)}>
                    Deactivate
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={() => void handleDelete(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={jobs}
        isLoading={loading}
        emptyMessage="No jobs found"
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Edit Job"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSaveEdit()} isLoading={submitting}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="admin-form-grid">
          <FormInput
            label="Title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
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
        </div>
      </Modal>
    </div>
  )
}
