import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(null);
      }
    }
    // Also try to fetch the latest profile from server if token exists
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const serverUser = res?.data?.user;
          if (serverUser) {
            setUser((prev) => ({ ...prev, ...serverUser }));
            // Keep localStorage in sync so future loads have fresh data
            const merged = { ...(JSON.parse(localStorage.getItem('user') || '{}')), ...serverUser };
            localStorage.setItem('user', JSON.stringify(merged));
          }
        })
        .catch(() => {})
        .finally(() => {});
    }
  }, []);

  const currentYear = new Date().getFullYear();

  const getYearSuffix = (n) => {
    const v = n % 100;
    if (v >= 11 && v <= 13) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const computeStudentYear = (startYear, passOutYear) => {
    const s = Number.isFinite(startYear) ? startYear : (startYear ? Number(startYear) : undefined);
    const p = Number.isFinite(passOutYear) ? passOutYear : (passOutYear ? Number(passOutYear) : undefined);

    if (Number.isFinite(s)) {
      const year = currentYear - s + 1;
      const clamped = Math.max(1, Math.min(4, year));
      return `${clamped}${getYearSuffix(clamped)} Year Student`;
    }
    if (Number.isFinite(p)) {
      const year = 4 - (p - currentYear);
      const clamped = Math.max(1, Math.min(4, year));
      return `${clamped}${getYearSuffix(clamped)} Year Student`;
    }
    return 'Student Year N/A';
  };

  const styles = {
    container: {
      width: '45vw',
      maxWidth: '900px',
      minWidth: '520px',
      margin: '24px auto',
      background: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
    },    
    title: { fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#374151' },
    label: { fontWeight: 600 },
    value: {},
    badge: { display: 'inline-block', marginTop: '8px', background: '#eef2ff', color: '#3730a3', padding: '6px 10px', borderRadius: '9999px', fontWeight: 700 },
  };

  if (!user) {
    const emptyStyles = {
      container: {
        width: '45vw',
        maxWidth: '1000px',
        minWidth: '520px',
        margin: '24px auto',
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        textAlign: 'center'
      },
      title: { fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '8px' },      
      text: { color: '#6b7280', marginBottom: '12px' },
      links: { display: 'flex', gap: '10px', justifyContent: 'center' },
      btn: { padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, background: '#2563eb', color: '#fff' },
      altBtn: { padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, background: '#e5e7eb', color: '#111827' },
    };
    return (
      <div style={emptyStyles.container}>
        <div style={emptyStyles.title}><b>No profile data</b></div>
        <div style={emptyStyles.text}>Please login or signup to view your profile.</div>
        <div style={emptyStyles.links}>
          <Link to="/login" style={emptyStyles.btn}>Login</Link>
          <Link to="/signup" style={emptyStyles.altBtn}>Signup</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      <div style={styles.row}>
        <span style={styles.label}>Name</span>
        <span style={styles.value}>{user.name}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Email</span>
        <span style={styles.value}>{user.email}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Pass-out Year</span>
        <span style={styles.value}>{user.passOutYear ?? '—'}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Start Year</span>
        <span style={styles.value}>{user.startYear ?? '—'}</span>
      </div>
      <div style={styles.badge}>{computeStudentYear(user?.startYear, user?.passOutYear)}</div>
    </div>
  );
};

export default Profile;
