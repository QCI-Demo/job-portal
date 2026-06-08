import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../NavBar';

const items = [
  { label: 'Dashboard', href: '/dashboard', isActive: true },
  { label: 'Jobs', href: '/jobs' },
];

describe('NavBar', () => {
  it('renders brand and navigation items', () => {
    render(<NavBar brand="Job Portal" items={items} />);
    expect(screen.getByText('Job Portal')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Jobs' })).toBeInTheDocument();
  });

  it('marks active item with aria-current', () => {
    render(<NavBar brand="Job Portal" items={items} />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders user name and logout button', async () => {
    const onLogout = jest.fn();
    render(<NavBar brand="Job Portal" items={items} userName="Admin" onLogout={onLogout} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
