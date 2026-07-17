import { useState } from 'react'

const tabs = [
  { id: 'general', label: 'General', interactionId: 'admin.settings.tab.general' },
  { id: 'email', label: 'Email', interactionId: 'admin.settings.tab.email' },
  { id: 'moderation', label: 'Moderation', interactionId: 'admin.settings.tab.moderation' },
] as const

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('general')

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Admin · Settings</p>
        <h1 className="font-display text-3xl font-bold text-ink">Site settings</h1>
        <p className="mt-1 text-ink-muted">Configure platform defaults, email, and moderation rules.</p>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-surface-border pb-2" role="tablist" aria-label="Settings sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={[
              'min-h-[40px] rounded-md px-4 py-2 text-sm font-semibold',
              activeTab === tab.id ? 'bg-primary-100 text-primary-800' : 'text-ink-secondary hover:bg-white',
            ].join(' ')}
            data-interaction={tab.interactionId}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        className="max-w-2xl space-y-4 rounded-md border border-dashed border-surface-border bg-white p-5"
        data-interaction={`admin.settings.form.${activeTab}`}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold capitalize">{activeTab} settings</h2>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
            admin.settings.form.{activeTab}
          </span>
        </div>

        {activeTab === 'general' ? (
          <>
            <div>
              <label htmlFor="site-name" className="mb-1 block text-sm font-medium">
                Site name
              </label>
              <input id="site-name" className="input-field" defaultValue="JobPortal" />
            </div>
            <div>
              <label htmlFor="support-email" className="mb-1 block text-sm font-medium">
                Support email
              </label>
              <input id="support-email" type="email" className="input-field" defaultValue="support@jobportal.example" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked data-interaction="admin.settings.maintenance" />
              Allow public registration
            </label>
          </>
        ) : null}

        {activeTab === 'email' ? (
          <>
            <div>
              <label htmlFor="from-email" className="mb-1 block text-sm font-medium">
                From address
              </label>
              <input id="from-email" className="input-field" defaultValue="noreply@jobportal.example" />
            </div>
            <div>
              <label htmlFor="smtp-host" className="mb-1 block text-sm font-medium">
                SMTP host
              </label>
              <input id="smtp-host" className="input-field" placeholder="smtp.example.com" />
            </div>
          </>
        ) : null}

        {activeTab === 'moderation' ? (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked data-interaction="admin.settings.requireApproval" />
              Require admin approval before publishing jobs
            </label>
            <div>
              <label htmlFor="auto-flag" className="mb-1 block text-sm font-medium">
                Auto-flag keywords (comma-separated)
              </label>
              <textarea id="auto-flag" className="input-field min-h-[96px]" defaultValue="guaranteed income, work from home scam" />
            </div>
          </>
        ) : null}

        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary" data-interaction="admin.settings.save">
            Save settings
          </button>
          <button type="button" className="btn-secondary" data-interaction="admin.settings.reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}
