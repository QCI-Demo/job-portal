import React from 'react';
import './FormInput.css';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, fullWidth = true, id, className = '', ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div
        className={`dashboard-form-input${fullWidth ? ' dashboard-form-input--full-width' : ''} ${className}`}
      >
        <label htmlFor={inputId} className="dashboard-form-input__label">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`dashboard-form-input__field${error ? ' dashboard-form-input__field--error' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error ? (
          <span id={`${inputId}-hint`} className="dashboard-form-input__hint">
            {hint}
          </span>
        ) : null}
        {error ? (
          <span id={`${inputId}-error`} className="dashboard-form-input__error" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
