import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const flash = location.state?.flash;

  const styles = {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '32px 16px'
    },
    container: { 
      width: '100%', 
      maxWidth: '520px', 
      margin: '0', 
      background: '#fff', 
      padding: '24px', 
      borderRadius: '14px', 
      border: '1px solid #e2e8f0', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    },
    title: { fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textAlign: 'center' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' },
    label: { fontSize: '13px', color: '#64748b' },
    input: { padding: '11px 13px', fontSize: '15px', lineHeight: 1.6, borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    inputFocus: { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    button: { width: '100%', padding: '10px 18px', fontSize: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 160ms ease, box-shadow 160ms ease' },
    alt: { marginTop: '8px', fontSize: '13px', color: '#64748b', textAlign: 'center' },
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const res = await axios.post('/api/auth/login', { email, password });
      // Expecting { token, user: { name, email, ... } }
      const { token, user } = res.data || {};
      if (!token || !user) throw new Error('Invalid login response');

      // Persist so user stays logged in next time
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: user.name,
        email: user.email,
        startYear: user.startYear,
        passOutYear: user.passOutYear,
        department: user.department,
        rollNumber: user.rollNumber,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
      }));

      // Navigate back to the page the user tried to access, default to My Posts
      const from = location.state?.from || '/myposts';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Login</h1>
        {flash && (
          <div style={{
            marginBottom: 12,
            padding: '10px 12px',
            border: '1px solid #bbf7d0',
            background: '#dcfce7',
            color: '#065f46',
          borderRadius: 8,
          fontSize: 14,
        }}>
          {flash}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input style={{ ...styles.input, ...(emailFocused ? styles.inputFocus : {}) }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={{ ...styles.input, ...(passwordFocused ? styles.inputFocus : {}) }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} required />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div style={styles.alt}>
        Don&apos;t have an account? <Link to="/signup">Signup</Link>
      </div>
      </div>
    </div>
  );
};

export default Login;
