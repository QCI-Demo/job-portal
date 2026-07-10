type Column<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

type PlaceholderTableProps<T extends { id: string }> = {
  columns: Column<T>[]
  rows: T[]
  caption: string
  interactionId?: string
  emptyMessage?: string
}

export function PlaceholderTable<T extends { id: string }>({
  columns,
  rows,
  caption,
  interactionId = 'table.row',
  emptyMessage = 'No rows to display.',
}: PlaceholderTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-md border border-surface-border bg-white" data-interaction={interactionId}>
      <div className="flex items-center justify-between border-b border-surface-border bg-surface/60 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Table placeholder</p>
        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-900">
          {interactionId}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface text-ink-secondary">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={`px-3 py-2.5 font-semibold ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-ink-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-surface-border hover:bg-primary-50/40">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-3 py-3 text-ink ${column.className ?? ''}`}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-surface-border px-3 py-2 text-xs text-ink-muted">
        <span>
          Showing {rows.length} of {rows.length}
        </span>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary min-h-[36px] px-3 py-1.5 text-xs" data-interaction="table.prev">
            Previous
          </button>
          <button type="button" className="btn-secondary min-h-[36px] px-3 py-1.5 text-xs" data-interaction="table.next">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
