import { useEffect, useId, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export type DashboardNavItem = {
  label: string
  to: string
  end?: boolean
  interactionId: string
}

type DashboardShellProps = {
  brand: string
  roleLabel: string
  homeTo: string
  navItems: DashboardNavItem[]
  userName: string
}

export function DashboardShell({
  brand,
  roleLabel,
  homeTo,
  navItems,
  userName,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarId = useId()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors',
      isActive
        ? 'border-l-4 border-primary-600 bg-primary-50 text-primary-800'
        : 'border-l-4 border-transparent text-ink-secondary hover:bg-white hover:text-ink',
    ].join(' ')

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 sm:text-sm">
        High-fidelity wireframe prototype — interaction labels are for stakeholder review. Figma skipped per coding-only
        instructions.
      </div>

      <header className="sticky top-0 z-30 border-b border-surface-border bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-surface-border lg:hidden"
              aria-expanded={sidebarOpen}
              aria-controls={sidebarId}
              data-interaction="shell.sidebar.toggle"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span aria-hidden="true">☰</span>
            </button>
            <Link to={homeTo} className="font-display text-xl font-bold text-primary-700" data-interaction="shell.brand">
              {brand}
            </Link>
            <span className="hidden rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-muted sm:inline">
              {roleLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="btn-secondary min-h-[40px] px-3 py-2 text-sm" data-interaction="shell.viewPublic">
              View public site
            </Link>
            <button type="button" className="btn-secondary min-h-[40px] px-3 py-2 text-sm" data-interaction="shell.userMenu">
              {userName} ▾
            </button>
            <button type="button" className="btn-secondary min-h-[40px] px-3 py-2 text-sm" data-interaction="shell.logout">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-ink/30 lg:hidden"
            aria-label="Close navigation overlay"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside
          id={sidebarId}
          className={[
            'fixed inset-y-0 left-0 z-30 w-64 border-r border-surface-border bg-[#F5F5F5] pt-14 transition-transform lg:static lg:z-0 lg:translate-x-0 lg:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
          aria-label={`${roleLabel} navigation`}
        >
          <nav className="flex h-full flex-col p-3">
            <ul className="flex flex-1 flex-col gap-1" role="list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={navLinkClass}
                    data-interaction={item.interactionId}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-surface-border pt-3 text-xs text-ink-muted">
              Sidebar width 256px · content fluid · labeled interactions
            </p>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
