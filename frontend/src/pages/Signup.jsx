import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../features/auth/authSlice';
import { Navigate, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function Signup() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  if (token) return <Navigate to="/projects" replace />;

  function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return alert('Passwords do not match');
    dispatch(clearError());
    dispatch(signup({ name: form.name, email: form.email, password: form.password }));
  }

  return (
    <div className="auth-card">
      <div className="auth-left">
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2d6cdf' }} />
            <strong>TeamTasker</strong>
          </div>
          <img src="/illustration.svg" alt="illustration" style={{ width: 260 }} />
          <p style={{ color:'#475569', marginTop: 12 }}>Create your account to get started</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-title">Create Account</div>
        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input className="auth-input" placeholder="Confirm Password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <button className="auth-btn" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <div className="auth-meta">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}

