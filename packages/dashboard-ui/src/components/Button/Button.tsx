import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const classes = [
    'dashboard-btn',
    `dashboard-btn--${variant}`,
    `dashboard-btn--${size}`,
    fullWidth ? 'dashboard-btn--full-width' : '',
    isLoading ? 'dashboard-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="dashboard-btn__spinner" aria-hidden="true" /> : null}
      <span className={isLoading ? 'dashboard-btn__label--hidden' : ''}>{children}</span>
    </button>
  );
};
