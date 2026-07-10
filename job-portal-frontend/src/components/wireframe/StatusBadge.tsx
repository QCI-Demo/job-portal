const toneByStatus: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  SHORTLISTED: 'bg-green-100 text-green-800',
  PENDING: 'bg-amber-100 text-amber-900',
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  SUSPENDED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-slate-200 text-slate-700',
}

type StatusBadgeProps = {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = toneByStatus[status.toUpperCase()] ?? 'bg-slate-100 text-slate-700'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone}`}>
      {status.replace(/_/g, ' ').toLowerCase()}
    </span>
  )
}
