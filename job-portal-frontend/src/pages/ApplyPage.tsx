import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { submitApplication } from '../api/applications'
import { ApiError } from '../api/client'
import { fetchJobById } from '../api/jobs'
import { FormField } from '../components/FormField'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import type { Job } from '../types/job'
import { getCompanyName } from '../types/job'
import {
  MAX_RESUME_SIZE_BYTES,
  validateResumeFile,
} from '../utils/validation'
import { labelClassName } from '../utils/formStyles'

interface ApplyFormValues {
  coverLetter: string
}

function ApplyForm() {
  const { id: jobId } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [jobLoading, setJobLoading] = useState(true)
  const [jobError, setJobError] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | undefined>()
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormValues>({
    defaultValues: { coverLetter: '' },
  })

  useEffect(() => {
    if (!jobId) return

    let cancelled = false

    async function loadJob() {
      setJobLoading(true)
      setJobError(null)
      try {
        const data = await fetchJobById(jobId as string)
        if (!cancelled) {
          setJob(data)
        }
      } catch {
        if (!cancelled) {
          setJobError('Unable to load this job. It may no longer be available.')
        }
      } finally {
        if (!cancelled) {
          setJobLoading(false)
        }
      }
    }

    void loadJob()
    return () => {
      cancelled = true
    }
  }, [jobId])

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setResumeError(null)
    if (!file) {
      setResumeFile(undefined)
      return
    }
    const validation = validateResumeFile(file)
    if (validation !== true) {
      setResumeError(validation)
      setResumeFile(undefined)
      event.target.value = ''
      return
    }
    setResumeFile(file)
  }

  const onSubmit = async (values: ApplyFormValues) => {
    if (!jobId) return

    const resumeValidation = validateResumeFile(resumeFile)
    if (resumeValidation !== true) {
      setResumeError(resumeValidation)
      return
    }

    setServerError(null)
    try {
      await submitApplication({
        jobId,
        coverLetter: values.coverLetter.trim(),
        resume: resumeFile,
      })
      setSubmitted(true)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to submit your application. Please try again.'
      setServerError(message)
    }
  }

  if (!jobId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8" role="alert">
        <p className="text-red-800">Invalid job identifier.</p>
        <Link to="/jobs" className="mt-4 inline-block text-primary-700 underline">
          Back to job search
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div
          className="rounded-xl border border-green-200 bg-green-50 p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <h1 className="text-2xl font-bold text-green-900">Application submitted</h1>
          <p className="mt-3 text-green-800">
            Thank you for applying{job ? ` for ${job.title}` : ''}. We will review your
            application and contact you if there is a match.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={`/jobs/${jobId}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              View job details
            </Link>
            <Link
              to="/jobs"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Browse more jobs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-600" role="list">
          <li>
            <Link to="/jobs" className="hover:text-primary-600 focus:outline-none focus-visible:underline">
              Jobs
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {job && (
            <>
              <li>
                <Link
                  to={`/jobs/${jobId}`}
                  className="hover:text-primary-600 focus:outline-none focus-visible:underline"
                >
                  {job.title}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li className="text-slate-900" aria-current="page">
            Apply
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Apply for this role</h1>
        {jobLoading && (
          <p className="mt-2 text-slate-600" role="status">
            Loading job details…
          </p>
        )}
        {jobError && (
          <p className="mt-2 text-red-800" role="alert">
            {jobError}
          </p>
        )}
        {job && !jobLoading && (
          <p className="mt-2 text-slate-600">
            {job.title} at {getCompanyName(job.company)}
          </p>
        )}
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {serverError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Job application form">
          <div className="space-y-4">
            <FormField
              id="apply-cover-letter"
              label="Cover letter"
              required
              error={errors.coverLetter?.message}
              textarea
              textareaProps={{
                ...register('coverLetter', {
                  required: 'Cover letter is required',
                  validate: (value) =>
                    value.trim().length > 0 || 'Cover letter cannot be empty',
                  minLength: {
                    value: 20,
                    message: 'Cover letter should be at least 20 characters',
                  },
                }),
                rows: 8,
                placeholder: 'Tell us why you are a great fit for this role…',
              }}
            />

            <div>
              <label htmlFor="apply-resume" className={labelClassName}>
                Resume <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="apply-resume"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeChange}
                aria-invalid={Boolean(resumeError)}
                aria-describedby={resumeError ? 'apply-resume-error' : 'apply-resume-hint'}
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
              />
              <p id="apply-resume-hint" className="mt-1 text-xs text-slate-500">
                PDF or Word format, up to {MAX_RESUME_SIZE_BYTES / (1024 * 1024)} MB.
              </p>
              {resumeError && (
                <p id="apply-resume-error" className="mt-1 text-sm text-red-700" role="alert">
                  {resumeError}
                </p>
              )}
              {resumeFile && (
                <p className="mt-1 text-sm text-slate-600" role="status">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting || jobLoading}
              aria-busy={isSubmitting}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit application'}
            </button>
            <Link
              to={`/jobs/${jobId}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ApplyPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <ApplyForm />
      </ProtectedRoute>
    </Layout>
  )
}
