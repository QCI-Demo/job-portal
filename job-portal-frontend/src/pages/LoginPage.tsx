import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { login as loginUser } from '../api/auth'
import { ApiError } from '../api/client'
import { FormField } from '../components/FormField'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import type { LoginPayload } from '../types/user'

type LoginFormValues = LoginPayload

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser, isAuthenticated, loading: authLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Prefer returnUrl when present; otherwise send authenticated users home
  const returnUrl = searchParams.get('returnUrl') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(returnUrl, { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate, returnUrl])

  useEffect(() => {
    if (serverError) {
      errorRef.current?.focus()
    }
  }, [serverError])

  if (!authLoading && isAuthenticated) {
    return <Navigate to={returnUrl} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      // Server sets HttpOnly JWT cookie via Set-Cookie; credentials: 'include' stores it
      const user = await loginUser(values)
      setUser(user)
      navigate(returnUrl, { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Sign in failed. Check your email and password.'
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
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink-muted">
            New here?{' '}
            <Link
              to={
                returnUrl !== '/'
                  ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
                  : '/register'
              }
              className="font-medium text-primary-700 underline hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              Create an account
            </Link>
          </p>
        </header>

        <div className="rounded-xl border border-surface-border bg-white p-6 shadow-card">
          <div
            className="mb-6 flex rounded-lg bg-surface p-1"
            role="tablist"
            aria-label="Authentication"
          >
            <span
              role="tab"
              aria-selected="true"
              className="flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-primary-800 shadow-sm"
            >
              Login
            </span>
            <Link
              role="tab"
              aria-selected="false"
              to={
                returnUrl !== '/'
                  ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
                  : '/register'
              }
              className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-ink-secondary hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              Register
            </Link>
          </div>

          {serverError && (
            <div
              ref={errorRef}
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800"
              tabIndex={-1}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Sign in form">
            <div className="space-y-4">
              <FormField
                id="login-email"
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
                id="login-password"
                label="Password"
                required
                error={errors.password?.message}
                type="password"
                inputProps={{
                  ...register('password', {
                    required: 'Password is required',
                    minLength: { value: 1, message: 'Password is required' },
                  }),
                  autoComplete: 'current-password',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="btn-primary mt-6 w-full"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
