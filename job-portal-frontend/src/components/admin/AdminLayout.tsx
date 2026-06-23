import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '@jobportal/dashboard-ui/styles.css'
import './AdminLayout.css'

const navItems = [
  { label: 'Users', to: '/users' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Categories', to: '/categories' },
  { label: 'Settings', to: '/settings' },
  { label: 'Analytics', to: '/analytics' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-ui admin-layout">
      <header className="admin-layout__topbar">
        <div className="admin-layout__brand">Job Portal Admin</div>
        <div className="admin-layout__user">
          <span>{user?.name ?? 'Administrator'}</span>
          <button type="button" className="admin-layout__logout" onClick={() => void handleLogout()}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-layout__body">
        <nav className="admin-layout__sidebar" aria-label="Admin navigation">
          <ul className="admin-layout__nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-layout__nav-link${isActive ? ' admin-layout__nav-link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
