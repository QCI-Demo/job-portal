import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../DataTable';

interface Job {
  id: number;
  title: string;
  status: string;
}

const columns = [
  { key: 'title', header: 'Title' },
  { key: 'status', header: 'Status' },
];

const data: Job[] = [
  { id: 1, title: 'Software Engineer', status: 'Active' },
  { id: 2, title: 'Product Manager', status: 'Draft' },
];

describe('DataTable', () => {
  it('renders column headers and data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="No jobs found" />);
    expect(screen.getByText('No jobs found')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable columns={columns} data={[]} isLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const onRowClick = jest.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Software Engineer'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
