import { useEffect, useState } from 'react'
import { Button, FormInput } from '@jobportal/dashboard-ui'
import { getSiteSettings, updateSiteSettings } from '../../api/admin/settings'
import { useToast } from '../../context/ToastContext'
import type { SiteSettings } from '../../types/admin'
import { ApiError } from '../../api/client'

const defaultSettings: SiteSettings = {
  siteName: '',
  supportEmail: '',
  maintenanceMode: false,
  allowRegistration: true,
  maxApplicationsPerJob: 100,
}

export function SiteSettingsPage() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSettings() {
      setLoading(true)
      setError(null)
      try {
        const data = await getSiteSettings()
        if (!cancelled) {
          setSettings(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load settings'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSettings()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async () => {
    const previous = settings
    setSaving(true)

    try {
      const updated = await updateSiteSettings(settings)
      setSettings(updated)
      showToast('Settings saved successfully')
    } catch (err) {
      setSettings(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to save settings'
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading settings…
      </p>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Site Settings</h1>
        <Button variant="primary" onClick={() => void handleSave()} isLoading={saving}>
          Save Settings
        </Button>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="admin-form-grid" style={{ maxWidth: 640 }}>
        <FormInput
          label="Site Name"
          value={settings.siteName}
          onChange={(event) => setSettings((current) => ({ ...current, siteName: event.target.value }))}
        />
        <FormInput
          label="Support Email"
          type="email"
          value={settings.supportEmail}
          onChange={(event) =>
            setSettings((current) => ({ ...current, supportEmail: event.target.value }))
          }
        />
        <FormInput
          label="Max Applications Per Job"
          type="number"
          value={String(settings.maxApplicationsPerJob)}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              maxApplicationsPerJob: Number(event.target.value) || 0,
            }))
          }
        />
        <label className="admin-checkbox-field">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(event) =>
              setSettings((current) => ({ ...current, maintenanceMode: event.target.checked }))
            }
          />
          Maintenance mode
        </label>
        <label className="admin-checkbox-field">
          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={(event) =>
              setSettings((current) => ({ ...current, allowRegistration: event.target.checked }))
            }
          />
          Allow new user registration
        </label>
      </div>
    </div>
  )
}
