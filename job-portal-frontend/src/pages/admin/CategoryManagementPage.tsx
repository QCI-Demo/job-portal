import { useEffect, useState } from 'react'
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../api/admin/categories'
import { useToast } from '../../context/ToastContext'
import type { AdminCategory, CreateCategoryPayload } from '../../types/admin'
import { ApiError } from '../../api/client'

const emptyForm: CreateCategoryPayload = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
}

export function CategoryManagementPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [form, setForm] = useState<CreateCategoryPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAdminCategories()
        if (!cancelled) {
          setCategories(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load categories'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  const openCreateModal = () => {
    setEditingCategory(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (category: AdminCategory) => {
    setEditingCategory(category)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      isActive: category.isActive,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCategory(null)
    setForm(emptyForm)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showToast('Name and slug are required', 'error')
      return
    }

    setSubmitting(true)

    if (editingCategory) {
      const previous = categories
      const optimistic: AdminCategory = { ...editingCategory, ...form }
      setCategories((current) =>
        current.map((item) => (item.id === editingCategory.id ? optimistic : item)),
      )
      closeModal()

      try {
        const updated = await updateAdminCategory(editingCategory.id, form)
        setCategories((current) =>
          current.map((item) => (item.id === editingCategory.id ? updated : item)),
        )
        showToast('Category updated')
      } catch (err) {
        setCategories(previous)
        const message = err instanceof ApiError ? err.message : 'Failed to update category'
        showToast(message, 'error')
      } finally {
        setSubmitting(false)
      }
      return
    }

    try {
      const created = await createAdminCategory(form)
      setCategories((current) => [created, ...current])
      closeModal()
      showToast('Category created')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create category'
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category: AdminCategory) => {
    const previous = categories
    setCategories((current) => current.filter((item) => item.id !== category.id))

    try {
      await deleteAdminCategory(category.id)
      showToast('Category deleted')
    } catch (err) {
      setCategories(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to delete category'
      showToast(message, 'error')
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Category Management</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add Category
        </Button>
      </div>

      {error ? (
        <div className="admin-page__error" role="alert">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'slug', header: 'Slug' },
          {
            key: 'isActive',
            header: 'Status',
            render: (row) => (row.isActive ? 'Active' : 'Inactive'),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="admin-page__actions">
                <Button size="sm" variant="secondary" onClick={() => openEditModal(row)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => void handleDelete(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={categories}
        isLoading={loading}
        emptyMessage="No categories found"
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} isLoading={submitting}>
              Save
            </Button>
          </>
        }
      >
        <div className="admin-form-grid">
          <FormInput
            label="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <FormInput
            label="Slug"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
          />
          <FormInput
            label="Description"
            value={form.description ?? ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
          <label className="admin-checkbox-field">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(event) =>
                setForm((current) => ({ ...current, isActive: event.target.checked }))
              }
            />
            Active
          </label>
        </div>
      </Modal>
    </div>
  )
}
