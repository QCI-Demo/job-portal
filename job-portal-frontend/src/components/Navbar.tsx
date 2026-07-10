import { useEffect, useId, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
    isActive
      ? 'bg-primary-100 text-primary-800'
      : 'text-ink-secondary hover:bg-surface hover:text-ink',
  ].join(' ')

export function Navbar() {
  const { isAuthenticated, loading, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/80 bg-white/95 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
        style={{ minHeight: 'var(--header-height)' }}
      >
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-tight text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          onClick={closeMenu}
        >
          JobPortal
        </Link>

        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-surface-border text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className="text-xl leading-none">
            {menuOpen ? '✕' : '☰'}
          </span>
        </button>

        <div
          id={menuId}
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 right-0 top-full flex-col gap-3 border-b border-surface-border bg-white p-4 shadow-elevate md:static md:flex md:flex-row md:items-center md:gap-4 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1" role="list">
            <li>
              <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={navLinkClass} onClick={closeMenu}>
                Find Jobs
              </NavLink>
            </li>
            {!loading && isAuthenticated && (
              <li>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
            )}
          </ul>

          {!loading && (
            <div className="flex flex-col gap-2 border-t border-surface-border pt-3 md:flex-row md:items-center md:border-0 md:pt-0">
              {isAuthenticated ? (
                <>
                  <span className="px-1 text-sm text-ink-muted" aria-label={`Signed in as ${user?.name}`}>
                    Hi, {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary !min-h-[40px] !px-4 !py-2 !text-sm"
                    onClick={() => {
                      closeMenu()
                      void logout().then(() => window.location.assign('/'))
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="btn-primary !min-h-[40px] !px-4 !py-2 !text-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
