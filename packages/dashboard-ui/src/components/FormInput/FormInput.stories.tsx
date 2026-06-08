import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'Components/FormInput',
  component: FormInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: { label: 'Email Address', placeholder: 'you@example.com' },
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    type: 'password',
    hint: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    value: 'invalid',
    error: 'Please enter a valid email address',
  },
};
