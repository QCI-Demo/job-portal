import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  it('renders label and input', () => {
    render(<FormInput label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<FormInput label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('displays hint text', () => {
    render(<FormInput label="Password" hint="At least 8 characters" />);
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    render(<FormInput label="Name" />);
    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'John');
    expect(input).toHaveValue('John');
  });
});
