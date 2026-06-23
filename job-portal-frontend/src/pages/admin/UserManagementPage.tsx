import { useEffect, useState } from 'react'
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui'
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '../../api/admin/users'
import { useToast } from '../../context/ToastContext'
import type { AdminUser, CreateAdminUserPayload } from '../../types/admin'
import { ApiError } from '../../api/client'

const ROLE_OPTIONS = ['admin', 'employer', 'candidate']

const emptyForm: CreateAdminUserPayload = {
  name: '',
  email: '',
  password: '',
  roles: ['candidate'],
}

export function UserManagementPage() {
  const { showToast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<CreateAdminUserPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setLoading(true)
      setError(null)
      try {
        const data = await getAdminUsers()
        if (!cancelled) {
          setUsers(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load users'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadUsers()
    return () => {
      cancelled = true
    }
  }, [])

  const openCreateModal = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingUser(null)
    setForm(emptyForm)
    setFormError(null)
  }

  const handleDeactivate = async (user: AdminUser) => {
    const previous = users
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, status: 'inactive' as const } : item,
      ),
    )

    try {
      await updateAdminUser(user.id, { status: 'inactive' })
      showToast(`${user.name} has been deactivated`)
    } catch (err) {
      setUsers(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to deactivate user'
      showToast(message, 'error')
    }
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required')
      return
    }

    if (!editingUser && !form.password.trim()) {
      setFormError('Password is required for new users')
      return
    }

    setSubmitting(true)
    setFormError(null)

    if (editingUser) {
      const previous = users
      const optimisticUser: AdminUser = {
        ...editingUser,
        name: form.name,
        email: form.email,
        roles: form.roles,
      }

      setUsers((current) =>
        current.map((item) => (item.id === editingUser.id ? optimisticUser : item)),
      )
      closeModal()

      try {
        const updated = await updateAdminUser(editingUser.id, {
          name: form.name,
          email: form.email,
          roles: form.roles,
        })
        setUsers((current) =>
          current.map((item) => (item.id === editingUser.id ? updated : item)),
        )
        showToast('User updated successfully')
      } catch (err) {
        setUsers(previous)
        const message = err instanceof ApiError ? err.message : 'Failed to update user'
        showToast(message, 'error')
      } finally {
        setSubmitting(false)
      }
      return
    }

    try {
      const created = await createAdminUser(form)
      setUsers((current) => [created, ...current])
      closeModal()
      showToast('User created successfully')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create user'
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user: AdminUser) => {
    const previous = users
    setUsers((current) => current.filter((item) => item.id !== user.id))

    try {
      await deleteAdminUser(user.id)
      showToast('User deleted successfully')
    } catch (err) {
      setUsers(previous)
      const message = err instanceof ApiError ? err.message : 'Failed to delete user'
      showToast(message, 'error')
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">User Management</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add User
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
          { key: 'email', header: 'Email' },
          {
            key: 'roles',
            header: 'Roles',
            render: (row) => (Array.isArray(row.roles) ? row.roles.join(', ') : ''),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={`admin-health-badge admin-health-badge--${row.status === 'active' ? 'healthy' : 'down'}`}>
                {String(row.status)}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="admin-page__actions">
                <Button size="sm" variant="secondary" onClick={() => openEditModal(row)}>
                  Edit
                </Button>
                {row.status === 'active' ? (
                  <Button size="sm" variant="danger" onClick={() => void handleDeactivate(row)}>
                    Deactivate
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={() => void handleDelete(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={users}
        isLoading={loading}
        emptyMessage="No users found"
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Create User'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} isLoading={submitting}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </>
        }
      >
        <div className="admin-form-grid">
          {formError ? (
            <div className="admin-page__error" role="alert">
              {formError}
            </div>
          ) : null}
          <FormInput
            label="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          {!editingUser ? (
            <FormInput
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          ) : null}
          <div className="admin-role-select">
            <label htmlFor="user-role">Role</label>
            <select
              id="user-role"
              value={form.roles[0] ?? 'candidate'}
              onChange={(event) =>
                setForm((current) => ({ ...current, roles: [event.target.value] }))
              }
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
