import { useEffect, useState } from 'react';
import { Button, FormInput } from '@jobportal/dashboard-ui';
import { getAdminSettings, updateAdminSettings } from '../../api/admin/settings';
import { ApiError } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { AdminSettings } from '../../types/admin';

type SettingsTab = 'general' | 'email' | 'moderation';

const tabs: Array<{ id: SettingsTab; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'email', label: 'Email' },
  { id: 'moderation', label: 'Moderation' },
];

const defaultSettings: AdminSettings = {
  general: {
    siteName: '',
    supportEmail: '',
    allowPublicRegistration: true,
  },
  email: {
    fromAddress: '',
    smtpHost: '',
  },
  moderation: {
    requireApproval: true,
    autoFlagKeywords: [],
  },
};

export function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [baseline, setBaseline] = useState<AdminSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordsText, setKeywordsText] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminSettings();
        if (!cancelled) {
          setSettings(data);
          setBaseline(data);
          setKeywordsText((data.moderation.autoFlagKeywords ?? []).join(', '));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load settings';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload: AdminSettings = {
      ...settings,
      moderation: {
        ...settings.moderation,
        autoFlagKeywords: keywordsText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      },
    };

    const previous = baseline;
    setBaseline(payload);
    setSettings(payload);

    try {
      const saved = await updateAdminSettings(payload);
      setSettings(saved);
      setBaseline(saved);
      setKeywordsText((saved.moderation.autoFlagKeywords ?? []).join(', '));
      showToast('Settings saved successfully');
    } catch (err) {
      setSettings(previous);
      setBaseline(previous);
      setKeywordsText((previous.moderation.autoFlagKeywords ?? []).join(', '));
      const message = err instanceof ApiError ? err.message : 'Failed to save settings';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(baseline);
    setKeywordsText((baseline.moderation.autoFlagKeywords ?? []).join(', '));
  };

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading settings…
      </p>
    );
  }

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Site settings</h1>
          <p className="admin-page__subtitle">
            Configure platform defaults, email, and moderation rules.
          </p>
        </div>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="admin-settings-tabs" role="tablist" aria-label="Settings sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`admin-settings-tab${activeTab === tab.id ? ' admin-settings-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form className="admin-settings-form" onSubmit={(event) => void handleSave(event)}>
        {activeTab === 'general' ? (
          <>
            <FormInput
              label="Site name"
              value={settings.general.siteName}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  general: { ...current.general, siteName: event.target.value },
                }))
              }
            />
            <FormInput
              label="Support email"
              type="email"
              value={settings.general.supportEmail}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  general: { ...current.general, supportEmail: event.target.value },
                }))
              }
            />
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={settings.general.allowPublicRegistration}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    general: {
                      ...current.general,
                      allowPublicRegistration: event.target.checked,
                    },
                  }))
                }
              />
              Allow public registration
            </label>
          </>
        ) : null}

        {activeTab === 'email' ? (
          <>
            <FormInput
              label="From address"
              type="email"
              value={settings.email.fromAddress}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  email: { ...current.email, fromAddress: event.target.value },
                }))
              }
            />
            <FormInput
              label="SMTP host"
              value={settings.email.smtpHost}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  email: { ...current.email, smtpHost: event.target.value },
                }))
              }
              placeholder="smtp.example.com"
            />
          </>
        ) : null}

        {activeTab === 'moderation' ? (
          <>
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={settings.moderation.requireApproval}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    moderation: {
                      ...current.moderation,
                      requireApproval: event.target.checked,
                    },
                  }))
                }
              />
              Require admin approval before publishing jobs
            </label>
            <div className="admin-form-textarea">
              <label htmlFor="admin-auto-flag">Auto-flag keywords (comma-separated)</label>
              <textarea
                id="admin-auto-flag"
                value={keywordsText}
                onChange={(event) => setKeywordsText(event.target.value)}
              />
            </div>
          </>
        ) : null}

        <div className="admin-settings-actions">
          <Button type="submit" variant="primary" isLoading={saving}>
            Save settings
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset} disabled={saving}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
