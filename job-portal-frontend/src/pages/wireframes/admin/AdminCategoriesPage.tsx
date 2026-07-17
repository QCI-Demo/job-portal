import { useState } from 'react'
import { ConfirmModal } from '../../../components/wireframe/ConfirmModal'
import { PlaceholderTable } from '../../../components/wireframe/PlaceholderTable'
import { StatusBadge } from '../../../components/wireframe/StatusBadge'
import { adminCategories } from '../../../data/wireframeMock'

export function AdminCategoriesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<(typeof adminCategories)[number] | null>(null)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Admin · Categories</p>
          <h1 className="font-display text-3xl font-bold text-ink">Category management</h1>
          <p className="mt-1 text-ink-muted">Create, rename, activate, or remove job categories.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          data-interaction="admin.categories.create"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          + Add category
        </button>
      </header>

      <PlaceholderTable
        caption="Job categories"
        interactionId="admin.categories.table"
        rows={adminCategories}
        columns={[
          { key: 'name', header: 'Name', render: (row) => row.name },
          { key: 'slug', header: 'Slug', render: (row) => row.slug },
          { key: 'jobs', header: 'Jobs', render: (row) => row.jobs },
          {
            key: 'active',
            header: 'Status',
            render: (row) => <StatusBadge status={row.active ? 'Active' : 'Closed'} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary-700"
                  data-interaction={`admin.categories.edit.${row.id}`}
                  onClick={() => {
                    setEditing(row)
                    setFormOpen(true)
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700"
                  data-interaction={`admin.categories.delete.${row.id}`}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />

      {formOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close category form"
            onClick={() => setFormOpen(false)}
          />
          <form
            className="relative w-full max-w-md space-y-4 rounded-md border border-surface-border bg-white p-5 shadow-elevate"
            data-interaction="admin.categories.form"
            onSubmit={(event) => {
              event.preventDefault()
              setFormOpen(false)
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit category' : 'Add category'}</h2>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
                admin.categories.form
              </span>
            </div>
            <div>
              <label htmlFor="cat-name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <input id="cat-name" className="input-field" defaultValue={editing?.name ?? ''} required />
            </div>
            <div>
              <label htmlFor="cat-slug" className="mb-1 block text-sm font-medium">
                Slug
              </label>
              <input id="cat-slug" className="input-field" defaultValue={editing?.slug ?? ''} required />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={editing?.active ?? true} data-interaction="admin.categories.active" />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" data-interaction="admin.categories.save">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <ConfirmModal
        open={deleteOpen}
        title="Delete category?"
        description="Categories with linked jobs cannot be deleted. Deactivate instead if jobs exist."
        confirmLabel="Delete"
        destructive
        interactionId="admin.categories.confirmDelete"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
      />
    </div>
  )
}
