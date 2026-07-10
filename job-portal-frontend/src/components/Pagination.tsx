interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  idPrefix?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  idPrefix = 'jobs',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Job results pagination"
    >
      <button
        type="button"
        id={`${idPrefix}-prev`}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        Previous
      </button>
      <ul className="flex flex-wrap gap-1" role="list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        id={`${idPrefix}-next`}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        Next
      </button>
    </nav>
  )
}
