import type { ReactNode } from 'react'
import { inputClassName, inputErrorClassName, labelClassName } from '../utils/formStyles'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  hint?: string
  children?: ReactNode
  type?: 'text' | 'email' | 'password' | 'tel'
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textarea?: boolean
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export function FormField({
  id,
  label,
  error,
  required,
  hint,
  children,
  type = 'text',
  inputProps,
  textarea,
  textareaProps,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  const fieldClassName = error ? inputErrorClassName : inputClassName

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && (
          <span className="text-red-700" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="mb-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {children ??
        (textarea ? (
          <textarea
            id={id}
            className={`${fieldClassName} min-h-[120px]`}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={required}
            {...textareaProps}
          />
        ) : (
          <input
            id={id}
            type={type}
            className={fieldClassName}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={required}
            {...inputProps}
          />
        ))}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
