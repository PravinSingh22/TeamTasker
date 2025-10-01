import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => (typeof document !== 'undefined' ? document.documentElement.dataset.theme || 'dark' : 'dark'));
  const token = useSelector((s) => s.auth.token);
  const notifications = useSelector((s) => s.notifications?.items || []);
  const unread = notifications.filter((n) => !n.read).length;
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
    setDropdownOpen(false);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next;
    }
    try { localStorage.setItem('theme', next); } catch (e) {}
  };

  return (
    <header className="app-header">
      <div className="app-header-logo">
        <LogoIcon />
        <strong>TASKIFY</strong>
      </div>
      <nav className="app-header-nav">
        {token && (
          <>
            <Link to="/projects" style={{ color: 'var(--fg)' }}>Projects</Link>
            <Link to="/analytics" style={{ color: 'var(--fg)' }}>Analytics</Link>
            <Link to="/notifications" title="Notifications" style={{ position: 'relative', color: 'var(--fg)', display: 'grid', placeItems: 'center' }}>
              <BellIcon />
              {unread > 0 && <span className="notification-badge">{unread}</span>}
            </Link>
            <div style={{ position: 'relative' }}>
              <div
                title={user?.name || ''}
                className="avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <label className="theme-switch" title="Toggle theme">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            aria-label="Toggle theme"
          />
          <span className="slider">
            <span className="icon-wrapper">
              <MoonIcon />
              <SunIcon />
            </span>
          </span>
        </label>
      </nav>
    </header>
  );
}

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="8" fill="url(#logo-gradient)"/>
    <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs><linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
