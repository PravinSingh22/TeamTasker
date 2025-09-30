import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import { Navigate, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function Login() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setRingPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e) => {
      const el = e.target;
      setIsPointer(window.getComputedStyle(el).cursor === 'pointer' || el.tagName === 'BUTTON' || el.tagName === 'A');
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (token) return <Navigate to="/projects" replace />;

  return (
    <div className="auth-page">
      <div className="grid-lines" />
      <div className="cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: ringPos.x, top: ringPos.y, width: isPointer ? 50 : 36, height: isPointer ? 50 : 36, borderColor: isPointer ? 'var(--accent)' : 'rgba(0,230,255,0.6)' }} />
      <div className="auth-card neo-card">
      <div className="auth-left">
        <div>
          <div className="brand-row">
            <div className="brand-mark" />
            <strong className="brand-name">TASKIFY</strong>
          </div>
          <img src="/illustration.svg" alt="illustration" className="illust" />
          <p className="auth-caption">Your ultimate project management solution</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="orb one" />
        <div className="orb two" />
        <div className="auth-title">Sign In</div>
        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); dispatch(clearError()); dispatch(login(form)); }}>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="auth-btn" disabled={loading} type="submit">{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <div className="auth-meta">Don't have an account? <Link to="/signup">Create an Account</Link></div>
      </div>
      </div>
    </div>
  );
}

