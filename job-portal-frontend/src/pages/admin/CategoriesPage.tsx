import { useEffect, useState } from 'react';
import { Button, DataTable, FormInput, Modal } from '@jobportal/dashboard-ui';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../api/admin/categories';
import { ApiError } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { AdminCategory } from '../../types/admin';

interface CategoryFormState {
  name: string;
  slug: string;
  active: boolean;
}

const emptyForm: CategoryFormState = {
  name: '',
  slug: '',
  active: true,
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCategory(category: AdminCategory): AdminCategory {
  return {
    ...category,
    jobCount: category.jobCount ?? category.jobs ?? 0,
    active: Boolean(category.active),
  };
}

export function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminCategories();
        if (!cancelled) {
          setCategories(data.map(normalizeCategory));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Failed to load categories';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setSlugTouched(false);
    setModalOpen(true);
  };

  const openEdit = (category: AdminCategory) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      active: category.active,
    });
    setFormErrors({});
    setSlugTouched(true);
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }));
  };

  const handleSave = async () => {
    const nextErrors: Partial<Record<keyof CategoryFormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.slug.trim()) nextErrors.slug = 'Slug is required';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      active: form.active,
    };

    if (editing) {
      const previous = categories;
      setCategories((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...payload } : item)),
      );
      setModalOpen(false);

      try {
        const updated = normalizeCategory(await updateAdminCategory(editing.id, payload));
        setCategories((current) =>
          current.map((item) => (item.id === editing.id ? updated : item)),
        );
        showToast('Category updated successfully');
      } catch (err) {
        setCategories(previous);
        const message = err instanceof ApiError ? err.message : 'Failed to update category';
        showToast(message, 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimistic: AdminCategory = {
      id: tempId,
      ...payload,
      jobCount: 0,
    };
    setCategories((current) => [optimistic, ...current]);
    setModalOpen(false);

    try {
      const created = normalizeCategory(await createAdminCategory(payload));
      setCategories((current) => current.map((item) => (item.id === tempId ? created : item)));
      showToast('Category created successfully');
    } catch (err) {
      setCategories((current) => current.filter((item) => item.id !== tempId));
      const message = err instanceof ApiError ? err.message : 'Failed to create category';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    const previous = categories;
    const targetId = deleting.id;
    setCategories((current) => current.filter((item) => item.id !== targetId));
    setConfirmOpen(false);
    setDeleting(null);

    try {
      await deleteAdminCategory(targetId);
      showToast('Category deleted successfully');
    } catch (err) {
      setCategories(previous);
      const message = err instanceof ApiError ? err.message : 'Failed to delete category';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Category management</h1>
          <p className="admin-page__subtitle">
            Create, rename, activate, or remove job categories.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Add category
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
            key: 'jobCount',
            header: 'Jobs',
            render: (row) => String(row.jobCount ?? row.jobs ?? 0),
          },
          {
            key: 'active',
            header: 'Status',
            render: (row) => (
              <span
                className={`admin-status-badge admin-status-badge--${row.active ? 'active' : 'closed'}`}
              >
                {row.active ? 'Active' : 'Inactive'}
              </span>
            ),
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
                    openEdit(row as AdminCategory);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeleting(row as AdminCategory);
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={categories}
        isLoading={loading}
        emptyMessage="No categories yet."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit category' : 'Add category'}
        size="md"
        footer={
          <div className="admin-page__actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSave()} isLoading={submitting}>
              Save
            </Button>
          </div>
        }
      >
        <div className="admin-form-grid">
          <FormInput
            label="Name"
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={formErrors.name}
            required
          />
          <FormInput
            label="Slug"
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((current) => ({ ...current, slug: event.target.value }));
            }}
            error={formErrors.slug}
            required
          />
          <label className="admin-form-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({ ...current, active: event.target.checked }))
              }
            />
            Active
          </label>
        </div>
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleting(null);
        }}
        title="Delete category?"
        size="sm"
        footer={
          <div className="admin-page__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                setDeleting(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleDelete()}>
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Categories with linked jobs cannot be deleted. Deactivate instead if jobs exist.
          {deleting ? ` Delete "${deleting.name}"?` : null}
        </p>
      </Modal>
    </div>
  );
}
