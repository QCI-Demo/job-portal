type InteractionLabelProps = {
  id: string
  children: React.ReactNode
  className?: string
}

/** Visible annotation for stakeholder review of interaction points. */
export function InteractionLabel({ id, children, className = '' }: InteractionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      data-interaction={id}
      title={`Interaction: ${id}`}
    >
      <span
        aria-hidden="true"
        className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-900"
      >
        {id}
      </span>
      {children}
    </span>
  )
}
