import { useState } from 'react'
import { ConfirmModal } from '../../../components/wireframe/ConfirmModal'
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { adminUsers } from '../../../data/wireframeMock'

export function AdminUsersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedName, setSelectedName] = useState('Ava Chen')
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Admin · Users</p>
          <h1 className="font-display text-3xl font-bold text-ink">User management</h1>
          <p className="mt-1 text-ink-muted">Search, edit roles, and deactivate accounts.</p>
        </div>
        <button type="button" className="btn-primary" data-interaction="admin.users.invite">
          + Invite user
        </button>
      </header>

      <section
        className="flex flex-wrap items-end gap-3 rounded-md border border-dashed border-surface-border bg-white p-4"
        data-interaction="admin.users.filters"
      >
        <div className="min-w-[200px] flex-1">
          <label htmlFor="user-search" className="mb-1 block text-sm font-medium text-ink">
            Search
          </label>
          <input id="user-search" className="input-field" placeholder="Email or name" />
        </div>
        <div>
          <label htmlFor="user-role" className="mb-1 block text-sm font-medium text-ink">
            Role
          </label>
          <select id="user-role" className="input-field min-w-[140px]">
            <option value="">All roles</option>
            <option>admin</option>
            <option>employer</option>
            <option>candidate</option>
          </select>
        </div>
        <div>
          <label htmlFor="user-status" className="mb-1 block text-sm font-medium text-ink">
            Status
          </label>
          <select id="user-status" className="input-field min-w-[140px]">
            <option value="">All</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
        <button type="button" className="btn-secondary" data-interaction="admin.users.applyFilters">
          Apply
        </button>
      </section>

      <PlaceholderTable
        caption="Users"
        interactionId="admin.users.table"
        rows={adminUsers}
        columns={[
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'email', header: 'Email', render: (row) => row.email },
          { key: 'roles', header: 'Roles', render: (row) => row.roles },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          { key: 'joined', header: 'Joined', render: (row) => row.joined },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary-700"
                  data-interaction={`admin.users.edit.${row.id}`}
                  onClick={() => {
                    setSelectedName(row.name)
                    setDrawerOpen(true)
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-ink-muted"
                  data-interaction={`admin.users.more.${row.id}`}
                  onClick={() => setConfirmOpen(true)}
                >
                  ···
                </button>
              </div>
            ),
          },
        ]}
      />

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close edit user drawer"
            data-interaction="admin.users.drawer.backdrop"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-surface-border bg-white shadow-elevate">
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <h2 id="edit-user-title" className="font-display text-xl font-semibold">
                Edit user
              </h2>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
                admin.users.drawer
              </span>
            </div>
            <form
              className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
              onSubmit={(event) => {
                event.preventDefault()
                setDrawerOpen(false)
              }}
            >
              <div>
                <label htmlFor="edit-name" className="mb-1 block text-sm font-medium">
                  Full name
                </label>
                <input id="edit-name" className="input-field" defaultValue={selectedName} />
              </div>
              <div>
                <label htmlFor="edit-email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input id="edit-email" className="input-field" defaultValue="ava.chen@example.com" readOnly />
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Roles</legend>
                <div className="space-y-2">
                  {['admin', 'employer', 'candidate'].map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked={role === 'admin'} data-interaction={`admin.users.role.${role}`} />
                      {role}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="edit-status" className="mb-1 block text-sm font-medium">
                  Status
                </label>
                <select id="edit-status" className="input-field" defaultValue="Active">
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t border-surface-border pt-4">
                <button type="submit" className="btn-primary" data-interaction="admin.users.save">
                  Save
                </button>
                <button type="button" className="btn-secondary" data-interaction="admin.users.cancel" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                  data-interaction="admin.users.deactivate"
                  onClick={() => setConfirmOpen(true)}
                >
                  Deactivate account
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}

      <ConfirmModal
        open={confirmOpen}
        title="Deactivate account?"
        description="The user will lose access immediately. This action can be reversed later by an admin."
        confirmLabel="Deactivate"
        destructive
        interactionId="admin.users.confirmDeactivate"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  )
}
