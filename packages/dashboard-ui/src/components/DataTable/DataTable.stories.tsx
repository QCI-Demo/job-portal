import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const jobData = [
  { id: 1, title: 'Software Engineer', company: 'Acme Corp', status: 'Active', applicants: 24 },
  { id: 2, title: 'Product Manager', company: 'Tech Inc', status: 'Draft', applicants: 0 },
  { id: 3, title: 'UX Designer', company: 'Design Co', status: 'Active', applicants: 12 },
];

const jobColumns = [
  { key: 'title', header: 'Job Title' },
  { key: 'company', header: 'Company' },
  { key: 'status', header: 'Status' },
  { key: 'applicants', header: 'Applicants' },
];

export const Default: Story = {
  args: { columns: jobColumns, data: jobData },
};

export const Empty: Story = {
  args: { columns: jobColumns, data: [], emptyMessage: 'No jobs posted yet' },
};

export const Loading: Story = {
  args: { columns: jobColumns, data: [], isLoading: true },
};
