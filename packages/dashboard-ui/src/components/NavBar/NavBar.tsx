import React from 'react';
import './NavBar.css';

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavBarProps {
  brand: string;
  items: NavItem[];
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  brand,
  items,
  userName,
  onLogout,
  className = '',
}) => {
  return (
    <nav className={`dashboard-navbar ${className}`} aria-label="Main navigation">
      <div className="dashboard-navbar__brand">{brand}</div>
      <ul className="dashboard-navbar__items">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`dashboard-navbar__link${item.isActive ? ' dashboard-navbar__link--active' : ''}`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="dashboard-navbar__actions">
        {userName ? <span className="dashboard-navbar__user">{userName}</span> : null}
        {onLogout ? (
          <button type="button" className="dashboard-navbar__logout" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
};
