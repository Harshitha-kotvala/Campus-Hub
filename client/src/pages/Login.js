import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const flash = location.state?.flash;

  const styles = {
    container: { width: '45vw', maxWidth: '1400px', minWidth: '680px', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    title: { fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px', textAlign: 'center' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
    label: { fontSize: '14px', color: '#374151' },
    input: { padding: '11px 13px', fontSize: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' },
    button: { width: '100%', padding: '10px 14px', fontSize: '15px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
    alt: { marginTop: '10px', fontSize: '14px', textAlign: 'center' },
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
          <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div style={styles.alt}>
        Don&apos;t have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
};

export default Login;
