type ConfirmModalProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  interactionId: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  interactionId,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close dialog"
        data-interaction={`${interactionId}.backdrop`}
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-md border border-surface-border bg-white p-5 shadow-elevate">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id="confirm-title" className="font-display text-xl font-semibold text-ink">
            {title}
          </h2>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
            {interactionId}
          </span>
        </div>
        <p className="text-sm text-ink-muted">{description}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn-secondary" data-interaction={`${interactionId}.cancel`} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={
              destructive
                ? 'inline-flex min-h-[44px] items-center justify-center rounded-md bg-red-700 px-6 py-3 text-base font-semibold text-white hover:bg-red-800'
                : 'btn-primary'
            }
            data-interaction={`${interactionId}.confirm`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
