import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { getCurrentUser, updateCurrentUser } from '../api/users'
import { FormField } from '../components/FormField'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import type { UpdateProfilePayload } from '../types/user'

type ProfileFormValues = Required<Pick<UpdateProfilePayload, 'name' | 'email' | 'phone'>>

function ProfileForm() {
  const { user, setUser, logout } = useAuth()
  const { showToast } = useToast()
  const [serverError, setServerError] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  })

  // Fetch current user on mount via JWT HttpOnly session cookie (GET /users/me)
  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      setProfileLoading(true)
      setServerError(null)
      try {
        const current = await getCurrentUser()
        if (!cancelled) {
          setUser(current)
        }
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
          return
        }
        setServerError(
          error instanceof ApiError
            ? error.message
            : 'Unable to load your profile. Please try again.',
        )
      } finally {
        if (!cancelled) {
          setProfileLoading(false)
        }
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [setUser])

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
      })
    }
  }, [user, reset])

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null)
    try {
      const updated = await updateCurrentUser({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
      })
      setUser(updated)
      reset({
        name: updated.name,
        email: updated.email,
        phone: updated.phone ?? '',
      })
      showToast('Profile saved successfully.')
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to save profile. Please try again.'
      setServerError(message)
      showToast(message, 'error')
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">My profile</h1>
        <p className="mt-2 text-ink-muted">View and update your personal information.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Profile sections">
          <nav>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1" role="list">
              <li>
                <span
                  className="block rounded-md bg-primary-100 px-3 py-2 text-sm font-medium text-primary-800"
                  aria-current="page"
                >
                  Personal info
                </span>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="block rounded-md px-3 py-2 text-sm text-ink-secondary hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                >
                  Browse jobs
                </Link>
              </li>
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => void logout().then(() => window.location.assign('/'))}
            className="btn-secondary mt-6 !px-4 !py-2 !text-sm"
          >
            Log out
          </button>
        </aside>

        <section
          className="rounded-xl border border-surface-border bg-white p-6 shadow-card"
          aria-labelledby="personal-info-heading"
        >
          <div className="mb-6 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-800"
              aria-hidden="true"
            >
              {initials || '?'}
            </div>
            <div>
              <h2 id="personal-info-heading" className="text-lg font-semibold text-ink">
                Personal information
              </h2>
              <p className="text-sm text-ink-muted">Update your contact details below.</p>
            </div>
          </div>

          {profileLoading && (
            <p role="status" aria-live="polite" className="mb-4 text-sm text-ink-muted">
              Loading your profile…
            </p>
          )}

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800"
              tabIndex={-1}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Profile form">
            <fieldset disabled={profileLoading} className="min-w-0 border-0 p-0">
              <legend className="sr-only">Personal information</legend>
              <div className="space-y-4">
                <FormField
                  id="profile-name"
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
                  id="profile-email"
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
                  id="profile-phone"
                  label="Phone"
                  error={errors.phone?.message}
                  type="tel"
                  hint="Optional. Include country code if outside your region."
                  inputProps={{
                    ...register('phone', {
                      validate: (value) => {
                        const trimmed = value?.trim() ?? ''
                        if (!trimmed) return true
                        return (
                          /^[+]?[\d\s()-]{7,20}$/.test(trimmed) ||
                          'Enter a valid phone number'
                        )
                      },
                    }),
                    autoComplete: 'tel',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isDirty || profileLoading}
                aria-busy={isSubmitting}
                className="btn-primary mt-6"
              >
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </button>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  )
}

export function ProfilePage() {
  return (
    <Layout>
      <ProtectedRoute>
        <ProfileForm />
      </ProtectedRoute>
    </Layout>
  )
}
