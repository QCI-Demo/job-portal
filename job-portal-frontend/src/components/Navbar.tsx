import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    isActive
      ? 'bg-primary-100 text-primary-800'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export function Navbar() {
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
        </ul>
      </nav>
    </header>
  )
}
