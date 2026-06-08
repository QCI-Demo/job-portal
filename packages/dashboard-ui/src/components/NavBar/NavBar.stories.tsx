import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from './NavBar';

const meta: Meta<typeof NavBar> = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

const defaultItems = [
  { label: 'Dashboard', href: '/dashboard', isActive: true },
  { label: 'Users', href: '/users' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Settings', href: '/settings' },
];

export const Admin: Story = {
  args: {
    brand: 'Job Portal Admin',
    items: defaultItems,
    userName: 'Admin User',
    onLogout: () => alert('Logged out'),
  },
};

export const Employer: Story = {
  args: {
    brand: 'Employer Dashboard',
    items: [
      { label: 'Overview', href: '/overview', isActive: true },
      { label: 'My Jobs', href: '/my-jobs' },
      { label: 'Applications', href: '/applications' },
    ],
    userName: 'Acme Corp',
  },
};
