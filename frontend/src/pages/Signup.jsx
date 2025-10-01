import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from '../features/auth/authSlice';
import { Navigate, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function Signup() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return alert('Passwords do not match');
    dispatch(clearError());
    dispatch(signup({ name: form.name, email: form.email, password: form.password }));
  }

  return (
    <div className="auth-page">
      <div className="grid-lines" />
      <div className="cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: ringPos.x, top: ringPos.y, width: isPointer ? 50 : 36, height: isPointer ? 50 : 36, borderColor: isPointer ? 'var(--accent)' : 'rgba(0,230,255,0.6)' }} />
      <div className="auth-card neo-card">
        <div className="auth-left">
          <div>
            <div className="brand-row" style={{ marginBottom: 16 }}>
              <LogoIcon />
              <strong className="brand-name">TASKIFY</strong>
            </div>
            <img src="/illustration.svg" alt="Team collaborating on tasks" className="illust" />
            <p className="auth-caption">Create your account to get started</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="orb one" />
          <div className="orb two" />
          <div className="auth-title">Create Account</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={onSubmit} className="auth-form">
            <div className="input-wrapper auth-form-field">
              <UserIcon />
              <input
                className="auth-input with-icon"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="input-wrapper auth-form-field">
              <MailIcon />
              <input
                className="auth-input with-icon"
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="password-wrapper auth-form-field">
              <LockIcon />
              <input
                className="auth-input"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className="password-wrapper auth-form-field">
              <LockIcon />
              <input
                className="auth-input"
                placeholder="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button className="auth-btn" disabled={loading} type="submit">
              {loading ? <Spinner /> : 'Create Account'}
            </button>
          </form>
          <div className="auth-meta">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}

const Spinner = () => (
  <div className="spinner" />
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="8" fill="url(#logo-gradient)"/>
    <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs><linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
