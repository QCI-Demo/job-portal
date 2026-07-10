import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { SkipToContent } from './SkipToContent'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <footer className="mt-auto bg-footer-bg text-footer-text" role="contentinfo">
        <div className="mx-auto grid max-w-container gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-xl font-bold text-white">JobPortal</p>
            <p className="mt-2 max-w-xs text-sm text-footer-text/80">
              Discover roles, apply with confidence, and manage your candidate profile in one place.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Explore</h2>
            <ul className="mt-3 space-y-2 text-sm" role="list">
              <li>
                <Link className="hover:underline focus-visible:underline" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:underline focus-visible:underline" to="/jobs">
                  Find jobs
                </Link>
              </li>
              <li>
                <Link className="hover:underline focus-visible:underline" to="/register">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Account</h2>
            <ul className="mt-3 space-y-2 text-sm" role="list">
              <li>
                <Link className="hover:underline focus-visible:underline" to="/login">
                  Sign in
                </Link>
              </li>
              <li>
                <Link className="hover:underline focus-visible:underline" to="/profile">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Legal</h2>
            <ul className="mt-3 space-y-2 text-sm" role="list">
              <li>
                <a className="hover:underline focus-visible:underline" href="#privacy">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:underline focus-visible:underline" href="#terms">
                  Terms
                </a>
              </li>
              <li>
                <a className="hover:underline focus-visible:underline" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-footer-text/70">
          &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
