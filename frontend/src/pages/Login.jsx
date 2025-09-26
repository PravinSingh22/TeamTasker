import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import { Navigate, Link } from 'react-router-dom';
import './AuthLayout.css';

export default function Login() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  if (token) return <Navigate to="/projects" replace />;

  return (
    <div className="auth-card">
      <div className="auth-left">
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2d6cdf' }} />
            <strong>TeamTasker</strong>
          </div>
          <img src="/illustration.svg" alt="illustration" style={{ width: 260 }} />
          <p style={{ color:'#475569', marginTop: 12 }}>Your ultimate project management solution</p>
        </div>
      </div>
      <div className="auth-right">
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
  );
}

