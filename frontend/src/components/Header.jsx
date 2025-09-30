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
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', background: 'var(--bg-elev)', borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 10, color: 'var(--fg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--neon-2), var(--neon))', boxShadow: 'var(--glow)' }} />
        <strong style={{ letterSpacing: .3 }}>TeamTasker</strong>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {token && (
          <>
            <Link to="/projects" style={{ color: 'var(--fg)' }}>Projects</Link>
            <Link to="/analytics" style={{ color: 'var(--fg)' }}>Analytics</Link>
            <Link to="/notifications" style={{ position: 'relative', color: 'var(--fg)' }}>
              Notifications
              {unread > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -10, background: '#e11d48', color: '#fff', borderRadius: 8, padding: '0 6px', fontSize: 12 }}>{unread}</span>
              )}
            </Link>
            <div style={{ position: 'relative' }}>
              <div
                title={user?.name || ''}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#0b1322', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: 'var(--neon)', cursor: 'pointer', boxShadow: 'var(--glow)' }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0, background: 'var(--bg-elev)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'var(--fg)',
                  minWidth: 160, zIndex: 20
                }}>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: '10px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--fg)' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <button onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme"
          style={{
            marginLeft: 8, background: 'linear-gradient(135deg, var(--neon-2), var(--neon))', color: '#00131a',
            border: 'none', padding: '6px 10px', borderRadius: 999, cursor: 'pointer', fontWeight: 800,
            boxShadow: 'var(--glow)'
          }}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </nav>
    </header>
  );
}
