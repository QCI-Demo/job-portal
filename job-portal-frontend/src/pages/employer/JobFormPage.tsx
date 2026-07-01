import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, FormInput, Modal } from '@jobportal/dashboard-ui';
import {
  createEmployerJob,
  deactivateEmployerJob,
  getEmployerJob,
  updateEmployerJob,
} from '../../api/employer/jobs';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../api/client';
import {
  hasJobFormErrors,
  validateJobForm,
  type JobFormErrors,
  type JobFormValues,
} from '../../utils/employerValidation';

const emptyForm: JobFormValues = {
  title: '',
  description: '',
  location: '',
  category: '',
};

export function JobFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<JobFormValues>(emptyForm);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const jobId = id;
    let cancelled = false;

    async function loadJob() {
      setLoading(true);
      setLoadError(null);
      try {
        const job = await getEmployerJob(jobId);
        if (!cancelled) {
          setForm({
            title: job.title,
            description: job.description,
            location: job.location,
            category: job.category ?? '',
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load job';
          setLoadError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadJob();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateJobForm(form);
    if (hasJobFormErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      category: form.category.trim() || undefined,
    };

    try {
      if (isEdit && id) {
        await updateEmployerJob(id, payload);
        showToast('Job updated successfully');
      } else {
        await createEmployerJob(payload);
        showToast('Job posted successfully');
      }
      navigate('/jobs');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : isEdit
            ? 'Failed to update job'
            : 'Failed to create job';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!id) return;

    setSubmitting(true);
    try {
      await deactivateEmployerJob(id);
      showToast('Job deactivated successfully');
      setDeactivateOpen(false);
      navigate('/jobs');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to deactivate job';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-slate-600">
        Loading job details…
      </p>
    );
  }

  if (loadError) {
    return (
      <div>
        <div className="employer-page__error" role="alert">
          {loadError}
        </div>
        <Button variant="secondary" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="employer-page__header">
        <h1 className="employer-page__title">{isEdit ? 'Edit Job' : 'Post a Job'}</h1>
      </div>

      <form
        className="employer-form-grid"
        onSubmit={(event) => void handleSubmit(event)}
        noValidate
      >
        <FormInput
          label="Title"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          error={errors.title}
          required
        />
        <div className="employer-form-textarea">
          <label htmlFor="job-description">Description</label>
          <textarea
            id="job-description"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'job-description-error' : undefined}
            required
          />
          {errors.description ? (
            <span id="job-description-error" className="employer-form-textarea__error" role="alert">
              {errors.description}
            </span>
          ) : null}
        </div>
        <FormInput
          label="Location"
          value={form.location}
          onChange={(event) => updateField('location', event.target.value)}
          error={errors.location}
          required
        />
        <FormInput
          label="Category"
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          hint="Optional"
        />

        <div className="employer-form-actions">
          <Button type="submit" variant="primary" isLoading={submitting}>
            {isEdit ? 'Save Changes' : 'Post Job'}
          </Button>
          <Link to="/jobs">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          {isEdit ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeactivateOpen(true)}
              disabled={submitting}
            >
              Deactivate
            </Button>
          ) : null}
        </div>
      </form>

      <Modal
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        title="Deactivate Job"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeactivateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleDeactivate()} isLoading={submitting}>
              Deactivate Job
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to deactivate this job? It will no longer accept new applications.
        </p>
      </Modal>
    </div>
  );
}
