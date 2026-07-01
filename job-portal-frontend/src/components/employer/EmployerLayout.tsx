import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '@jobportal/dashboard-ui/styles.css';
import './EmployerLayout.css';

const navItems = [
  { label: 'My Jobs', to: '/jobs' },
  { label: 'Post a Job', to: '/jobs/new' },
  { label: 'Applications', to: '/applications' },
];

export function EmployerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-ui employer-layout">
      <header className="employer-layout__topbar">
        <div className="employer-layout__brand">Job Portal Employer</div>
        <div className="employer-layout__user">
          <span>{user?.name ?? 'Employer'}</span>
          <button
            type="button"
            className="employer-layout__logout"
            onClick={() => void handleLogout()}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="employer-layout__body">
        <nav className="employer-layout__sidebar" aria-label="Employer navigation">
          <ul className="employer-layout__nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/jobs'}
                  className={({ isActive }) =>
                    `employer-layout__nav-link${isActive ? ' employer-layout__nav-link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="employer-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
