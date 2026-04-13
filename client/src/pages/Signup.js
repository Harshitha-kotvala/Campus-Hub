import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passOutYear, setPassOutYear] = useState('');
  const [startYear, setStartYear] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [startYearFocused, setStartYearFocused] = useState(false);
  const navigate = useNavigate();

  // Auto-calculate pass-out year when start year changes
  useEffect(() => {
    if (startYear) {
      setPassOutYear(parseInt(startYear) + 4);
    } else {
      setPassOutYear('');
    }
  }, [startYear]);

  const styles = {
    container: { width: '7vw', maxWidth: '1400px', minWidth: '680px', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    title: { fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px', textAlign: 'center' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
    label: { fontSize: '14px', color: '#374151' },
    input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    inputFocus: { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    button: { width: '100%', padding: '10px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
    alt: { marginTop: '10px', fontSize: '14px', textAlign: 'center' },
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const payload = {
        name,
        email,
        password,
        startYear: Number(startYear) || undefined,
        passOutYear: Number(passOutYear) || undefined,
      };
      await axios.post('/api/auth/signup', payload);
      // After successful signup, redirect to login and ask the user to log in
      navigate('/login', { state: { flash: 'Signup successful. Please log in to continue.' } });
    } catch (err) {
      // Helpful diagnostics in the browser console
      console.error('Signup request failed:', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
        method: err?.config?.method,
      });
      const msg = err?.response?.data?.message || err.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Signup</h1>
      <form onSubmit={onSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input style={{ ...styles.input, ...(nameFocused ? styles.inputFocus : {}) }} type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input style={{ ...styles.input, ...(emailFocused ? styles.inputFocus : {}) }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={{ ...styles.input, ...(passwordFocused ? styles.inputFocus : {}) }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Start Year</label>
          <select style={{ ...styles.input, ...(startYearFocused ? styles.inputFocus : {}) }} value={startYear} onChange={(e) => setStartYear(e.target.value)} onFocus={() => setStartYearFocused(true)} onBlur={() => setStartYearFocused(false)} required>
            <option value="" disabled>Select Start Year</option>
            {Array.from({ length: 6 }).map((_, idx) => {
              const year = new Date().getFullYear() - idx;
              return (
                <option key={year} value={year}>{year}</option>
              );
            })}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Pass-out Year</label>
          <input 
            style={{ ...styles.input, backgroundColor: '#f9fafb', cursor: 'not-allowed' }} 
            type="number" 
            value={passOutYear} 
            readOnly 
            required 
          />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>}
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
      </form>
      <div style={styles.alt}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;