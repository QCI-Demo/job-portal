import React, { useEffect, useRef } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dashboard-modal__overlay" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className={`dashboard-modal dashboard-modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dashboard-modal__header">
          <h2 id="dashboard-modal-title" className="dashboard-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="dashboard-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <div className="dashboard-modal__body">{children}</div>
        {footer ? <div className="dashboard-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
};
