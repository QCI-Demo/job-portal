import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Delete Job Posting',
    children: (
      <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
    ),
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Job Details',
    size: 'lg',
    children: <p>Detailed job information would appear here.</p>,
  },
};
