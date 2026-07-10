import { useEffect, useState } from 'react'
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

  const returnUrl = searchParams.get('returnUrl') ?? '/'

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

  if (!authLoading && isAuthenticated) {
    return <Navigate to={returnUrl} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
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
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            New here?{' '}
            <Link
              to={
                returnUrl !== '/'
                  ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
                  : '/register'
              }
              className="font-medium text-primary-700 underline hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Create an account
            </Link>
          </p>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {serverError && (
            <div
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
              className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary-600 px-4 py-3 text-base font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
