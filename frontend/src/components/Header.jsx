import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', background: '#fff', borderBottom: '1px solid #eaeaea',
      position: 'sticky', top: 0, zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2d6cdf' }} />
        <strong>TeamTasker</strong>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {token && (
          <>
            <Link to="/projects">Projects</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/notifications" style={{ position: 'relative' }}>
              Notifications
              {unread > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -10, background: '#e11d48', color: '#fff', borderRadius: 8, padding: '0 6px', fontSize: 12 }}>{unread}</span>
              )}
            </Link>
            <div style={{ position: 'relative' }}>
              <div
                title={user?.name || ''}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'grid', placeItems: 'center', color: '#2d6cdf', cursor: 'pointer' }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0, background: '#fff',
                  border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: 160, zIndex: 20
                }}>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: '10px 16px', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
