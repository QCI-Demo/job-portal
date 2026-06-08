# Job Portal — Shared Dashboard Component Library

Monorepo containing `@jobportal/dashboard-ui`, a reusable React component library for admin and employer dashboards.

## Packages

| Package                         | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `@jobportal/dashboard-ui`       | Core UI components (NavBar, DataTable, FormInput, Button, Modal, ChartContainer) |
| `@jobportal/dashboard-test-app` | Verification app that imports and renders all components                         |

## Quick Start

```bash
npm install
npm run build
npm test
npm run storybook
```

See [docs/USAGE.md](docs/USAGE.md) for installation, component API reference, and publishing instructions.

## Components

- **NavBar** — Top navigation with brand, links, and user actions
- **DataTable** — Generic data table with loading/empty states
- **FormInput** — Accessible form input with label, hint, and error
- **Button** — Action button with variants and loading state
- **Modal** — Dialog overlay with header, body, and footer
- **ChartContainer** — Analytics chart wrapper with title and actions

## Development

```bash
# Lint
npm run lint

# Format
npm run format

# Build library
npm run build

# Run tests
npm test

# Storybook
npm run storybook
```

## Publishing

The library publishes to the internal npm registry (Verdaccio at `http://localhost:4873`). See [docs/USAGE.md](docs/USAGE.md) for details.
