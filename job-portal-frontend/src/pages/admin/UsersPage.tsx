import { useEffect, useMemo, useState } from 'react';
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui';
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '../../api/admin/users';
import { ApiError } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { AdminUser, AdminUserRole, AdminUserStatus } from '../../types/admin';

const ROLE_OPTIONS: AdminUserRole[] = ['admin', 'employer', 'candidate'];
const STATUS_OPTIONS: AdminUserStatus[] = ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'];

interface UserFormState {
  name: string;
  email: string;
  password: string;
  roles: AdminUserRole[];
  status: AdminUserStatus;
}

const emptyForm: UserFormState = {
  name: '',
  email: '',
  password: '',
  roles: ['candidate'],
  status: 'ACTIVE',
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase();
}

function statusBadgeClass(status: string): string {
  return `admin-status-badge admin-status-badge--${status.toLowerCase()}`;
}

function normalizeUser(user: AdminUser): AdminUser {
  const roles = Array.isArray(user.roles)
    ? user.roles
    : typeof user.roles === 'string'
      ? (String(user.roles)
          .split(',')
          .map((role) => role.trim())
          .filter(Boolean) as AdminUserRole[])
      : [];

  return {
    ...user,
    roles,
    status: (String(user.status || 'ACTIVE').toUpperCase() as AdminUserStatus) || 'ACTIVE',
  };
}

export function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminUsers();
        if (!cancelled) {
          setUsers(data.map(normalizeUser));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load users';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter && !user.roles.includes(roleFilter as AdminUserRole)) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      if (!query) return true;
      return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    });
  }, [users, roleFilter, statusFilter, search]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles.length > 0 ? [...user.roles] : ['candidate'],
      status: user.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const toggleRole = (role: AdminUserRole) => {
    setForm((current) => {
      const hasRole = current.roles.includes(role);
      const roles = hasRole
        ? current.roles.filter((item) => item !== role)
        : [...current.roles, role];
      return { ...current, roles: roles.length > 0 ? roles : current.roles };
    });
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof UserFormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email';
    }
    if (!editingUser && !form.password.trim()) {
      nextErrors.password = 'Password is required for new users';
    }
    if (form.roles.length === 0) nextErrors.roles = 'Select at least one role';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      roles: form.roles,
      status: form.status,
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
    };

    if (editingUser) {
      const previous = users;
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: payload.name,
                email: payload.email,
                roles: payload.roles,
                status: payload.status,
              }
            : user,
        ),
      );
      setModalOpen(false);

      try {
        const updated = normalizeUser(await updateAdminUser(editingUser.id, payload));
        setUsers((current) => current.map((user) => (user.id === editingUser.id ? updated : user)));
        showToast('User updated successfully');
      } catch (err) {
        setUsers(previous);
        const message = err instanceof ApiError ? err.message : 'Failed to update user';
        showToast(message, 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimistic: AdminUser = {
      id: tempId,
      name: payload.name,
      email: payload.email,
      roles: payload.roles,
      status: payload.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers((current) => [optimistic, ...current]);
    setModalOpen(false);

    try {
      const created = normalizeUser(await createAdminUser(payload));
      setUsers((current) => current.map((user) => (user.id === tempId ? created : user)));
      showToast('User created successfully');
    } catch (err) {
      setUsers((current) => current.filter((user) => user.id !== tempId));
      const message = err instanceof ApiError ? err.message : 'Failed to create user';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUser) return;

    const previous = users;
    const targetId = deactivatingUser.id;
    setUsers((current) =>
      current.map((user) =>
        user.id === targetId ? { ...user, status: 'DEACTIVATED' as const } : user,
      ),
    );
    setConfirmOpen(false);
    setDeactivatingUser(null);

    try {
      await deleteAdminUser(targetId);
      showToast('User deactivated successfully');
    } catch (err) {
      setUsers(previous);
      const message = err instanceof ApiError ? err.message : 'Failed to deactivate user';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">User management</h1>
          <p className="admin-page__subtitle">
            List users, create accounts, edit roles, and deactivate access.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Create user
        </Button>
      </div>

      <div className="admin-filters">
        <div className="admin-filter-field" style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="admin-user-search">Search</label>
          <input
            id="admin-user-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Email or name"
          />
        </div>
        <div className="admin-filter-field">
          <label htmlFor="admin-user-role">Role</label>
          <select
            id="admin-user-role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="">All roles</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-filter-field">
          <label htmlFor="admin-user-status">Status</label>
          <select
            id="admin-user-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
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
            render: (row) =>
              Array.isArray(row.roles) ? row.roles.join(', ') : String(row.roles ?? ''),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={statusBadgeClass(String(row.status))}>
                {formatStatus(String(row.status))}
              </span>
            ),
          },
          {
            key: 'createdAt',
            header: 'Joined',
            render: (row) => String(row.createdAt ?? row.joined ?? '—'),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="admin-page__actions">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(event) => {
                    event.stopPropagation();
                    openEdit(row as AdminUser);
                  }}
                >
                  Edit
                </Button>
                {row.status !== 'DEACTIVATED' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeactivatingUser(row as AdminUser);
                      setConfirmOpen(true);
                    }}
                  >
                    Deactivate
                  </Button>
                ) : null}
              </div>
            ),
          },
        ]}
        data={filteredUsers}
        isLoading={loading}
        emptyMessage="No users found."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit user' : 'Create user'}
        size="md"
        footer={
          <div className="admin-page__actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSave()} isLoading={submitting}>
              {editingUser ? 'Save changes' : 'Create user'}
            </Button>
          </div>
        }
      >
        <div className="admin-form-grid">
          <FormInput
            label="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            error={formErrors.name}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            error={formErrors.email}
            required
          />
          {!editingUser ? (
            <FormInput
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              error={formErrors.password}
              required
            />
          ) : null}
          <fieldset className="admin-form-fieldset">
            <legend>Roles</legend>
            <div className="admin-form-checkboxes">
              {ROLE_OPTIONS.map((role) => (
                <label key={role}>
                  <input
                    type="checkbox"
                    checked={form.roles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  {role}
                </label>
              ))}
            </div>
            {formErrors.roles ? (
              <p className="admin-page__error" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                {formErrors.roles}
              </p>
            ) : null}
          </fieldset>
          <div className="admin-form-select">
            <label htmlFor="admin-user-form-status">Status</label>
            <select
              id="admin-user-form-status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as AdminUserStatus,
                }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeactivatingUser(null);
        }}
        title="Deactivate account?"
        size="sm"
        footer={
          <div className="admin-page__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                setDeactivatingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleDeactivate()}>
              Deactivate
            </Button>
          </div>
        }
      >
        <p>
          {deactivatingUser
            ? `${deactivatingUser.name} will lose access immediately. You can reactivate later by editing their status.`
            : 'This user will lose access immediately.'}
        </p>
      </Modal>
    </div>
  );
}
