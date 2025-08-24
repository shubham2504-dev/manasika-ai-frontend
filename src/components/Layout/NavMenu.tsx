import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationItem } from '../../types';

const navItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: '🏠'
  },
  {
    id: 'mood-tracker',
    label: 'Mood Tracker',
    path: '/mood-tracker',
    icon: '💝'
  },
  {
    id: 'chat',
    label: 'AI Coach',
    path: '/chat',
    icon: '🤖'
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: '👤'
  }
];

const NavMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <h2>🧠 Manasika</h2>
      </div>

      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
              aria-label={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <div className="nav-info">
          <p>Version 1.0.0</p>
          <p>Made with 💚 for mental wellness</p>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
