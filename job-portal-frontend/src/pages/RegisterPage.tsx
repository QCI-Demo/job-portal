import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { register as registerUser } from '../api/auth'
import { ApiError } from '../api/client'
import { FormField } from '../components/FormField'
import { Layout } from '../components/Layout'
import { useToast } from '../context/ToastContext'
import type { RegisterPayload } from '../types/user'
import { validatePasswordStrength } from '../utils/validation'

type RegisterFormValues = RegisterPayload

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  })

  const returnUrl = searchParams.get('returnUrl')

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await registerUser(values)
      showToast('Account created successfully. You can sign in now.')
      const loginPath = returnUrl
        ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : '/login'
      navigate(loginPath)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Registration failed. Please try again.'
      setServerError(message)
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-md flex-col px-4 py-10 sm:px-6">
        <header className="mb-8 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
            JobPortal
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Already have an account?{' '}
            <Link
              to={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}
              className="font-medium text-primary-700 underline hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              Sign in
            </Link>
          </p>
        </header>

        <div className="rounded-xl border border-surface-border bg-white p-6 shadow-card">
          <div
            className="mb-6 flex rounded-lg bg-surface p-1"
            role="tablist"
            aria-label="Authentication"
          >
            <Link
              role="tab"
              aria-selected="false"
              to={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}
              className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-ink-secondary hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              Login
            </Link>
            <span
              role="tab"
              aria-selected="true"
              className="flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-primary-800 shadow-sm"
            >
              Register
            </span>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800"
              tabIndex={-1}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Registration form">
            <div className="space-y-4">
              <FormField
                id="register-name"
                label="Full name"
                required
                error={errors.name?.message}
                inputProps={{
                  ...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  }),
                  autoComplete: 'name',
                }}
              />

              <FormField
                id="register-email"
                label="Email"
                required
                error={errors.email?.message}
                type="email"
                inputProps={{
                  ...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  }),
                  autoComplete: 'email',
                }}
              />

              <FormField
                id="register-password"
                label="Password"
                required
                hint="At least 8 characters with uppercase, lowercase, and a number."
                error={errors.password?.message}
                type="password"
                inputProps={{
                  ...register('password', {
                    required: 'Password is required',
                    validate: validatePasswordStrength,
                  }),
                  autoComplete: 'new-password',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="btn-primary mt-6 w-full"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
