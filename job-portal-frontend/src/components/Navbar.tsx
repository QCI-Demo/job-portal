import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    isActive
      ? 'bg-primary-100 text-primary-800'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

const authLinkClass =
  'inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

export function Navbar() {
  const { isAuthenticated, loading, user } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="text-xl font-bold text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          JobPortal
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ul className="flex flex-wrap items-center gap-1 sm:gap-2" role="list">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={navLinkClass}>
                Find Jobs
              </NavLink>
            </li>
            {!loading && isAuthenticated && (
              <li>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </li>
            )}
          </ul>
          {!loading && (
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
              {isAuthenticated ? (
                <span className="hidden text-sm text-slate-600 sm:inline" aria-label={`Signed in as ${user?.name}`}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`${authLinkClass} text-slate-700 hover:bg-slate-100`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`${authLinkClass} bg-primary-600 text-white hover:bg-primary-700`}
                  >
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
