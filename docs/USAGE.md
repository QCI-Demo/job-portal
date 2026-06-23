# @jobportal/dashboard-ui — Usage Guidelines

Shared React component library for the Job Portal admin and employer dashboards.

## Installation

Configure your `.npmrc` to point at the internal registry:

```ini
@jobportal:registry=http://localhost:4873
```

Install the package:

```bash
npm install @jobportal/dashboard-ui
```

## Quick Start

```tsx
import {
  NavBar,
  DataTable,
  FormInput,
  Button,
  Modal,
  ChartContainer,
} from '@jobportal/dashboard-ui';
import '@jobportal/dashboard-ui/styles.css';

function AdminDashboard() {
  return (
    <div className="dashboard-ui">
      <NavBar
        brand="Job Portal Admin"
        items={[
          { label: 'Dashboard', href: '/dashboard', isActive: true },
          { label: 'Users', href: '/users' },
        ]}
        userName="Admin"
        onLogout={() => {}}
      />
      {/* ... */}
    </div>
  );
}
```

> Wrap your app (or dashboard section) in a `dashboard-ui` class to apply base typography and CSS variables.

## Components

### NavBar

Top navigation bar with brand, links, user display, and logout.

| Prop       | Type          | Description                               |
| ---------- | ------------- | ----------------------------------------- |
| `brand`    | `string`      | Application name shown on the left        |
| `items`    | `NavItem[]`   | Navigation links with optional `isActive` |
| `userName` | `string?`     | Current user display name                 |
| `onLogout` | `() => void?` | Logout handler                            |

### DataTable

Generic data table with loading and empty states.

```tsx
<DataTable
  columns={[
    { key: 'title', header: 'Job Title' },
    { key: 'status', header: 'Status' },
  ]}
  data={jobs}
  onRowClick={(row) => navigate(`/jobs/${row.id}`)}
/>
```

### FormInput

Accessible labeled input with error and hint support.

```tsx
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

### Button

Primary action button with variants: `primary`, `secondary`, `danger`, `ghost`.

```tsx
<Button variant="primary" isLoading={saving} onClick={handleSave}>
  Save Changes
</Button>
```

### Modal

Dialog overlay with title, body, and optional footer actions.

```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Delete"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this job?</p>
</Modal>
```

### ChartContainer

Wrapper for analytics charts with title, subtitle, and action slots.

```tsx
<ChartContainer
  title="Applications"
  subtitle="Last 30 days"
  actions={
    <Button size="sm" variant="secondary">
      Export
    </Button>
  }
>
  <MyChartComponent data={chartData} />
</ChartContainer>
```

## Development

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Start Storybook
npm run storybook

# Build the library
npm run build
```

## Publishing

Start the local internal registry (Verdaccio):

```bash
npx verdaccio --config verdaccio-config.yaml
```

Publish from the package directory:

```bash
cd packages/dashboard-ui
npm publish
```

## Theming

Override CSS custom properties on `.dashboard-ui` or `:root`:

```css
.dashboard-ui {
  --dashboard-primary: #7c3aed;
  --dashboard-radius: 12px;
}
```

Available variables: `--dashboard-primary`, `--dashboard-primary-hover`, `--dashboard-secondary`, `--dashboard-danger`, `--dashboard-success`, `--dashboard-bg`, `--dashboard-surface`, `--dashboard-border`, `--dashboard-text`, `--dashboard-text-muted`, `--dashboard-radius`, `--dashboard-shadow`.
