import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [hoverSignup, setHoverSignup] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '14px',
      padding: '24px 16px',
      // Subtle professional gradient background
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2ff 100%)',
      borderRadius: '12px',
    },
    title: { fontSize: '32px', fontWeight: 800, color: '#111827', textAlign: 'center', letterSpacing: '-0.02em' },
    subtitle: { fontSize: '16px', color: '#6b7280', textAlign: 'center', maxWidth: '720px' },
    // Larger, more prominent card with soft shadow
    ctaCard: { width: '100%', maxWidth: '760px', marginTop: '14px', border: '1px solid #e5e7eb', background: '#ffffff', borderRadius: '14px', padding: '28px', boxShadow: '0 12px 30px rgba(2, 6, 23, 0.06), 0 4px 12px rgba(2, 6, 23, 0.04)' },
    ctaTitle: { fontSize: '20px', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: '10px' },
    ctaRow: { display: 'flex', justifyContent: 'center', gap: '12px' },
    // Base button styles with smooth hover animations
    primaryBtn: { textDecoration: 'none', padding: '12px 18px', borderRadius: '10px', background: '#2563eb', color: '#fff', fontWeight: 700, display: 'inline-block', transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.20)' },
    outlineBtn: { textDecoration: 'none', padding: '12px 18px', borderRadius: '10px', background: 'transparent', color: '#2563eb', fontWeight: 700, border: '1px solid #93c5fd', display: 'inline-block', transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease', boxShadow: '0 2px 8px rgba(2, 6, 23, 0.06)' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to CampusHub 🎓</h1>
      <p style={styles.subtitle}>Exclusively for students of Shri Vishnu Engineering College for Women</p>
      <div style={styles.ctaCard}>
        <div style={styles.ctaTitle}>Join the Community</div>
        <div style={styles.ctaRow}>
          <Link
            to="/signup"
            style={{
              ...styles.primaryBtn,
              transform: hoverSignup ? 'scale(1.04)' : 'scale(1)',
              boxShadow: hoverSignup ? '0 8px 18px rgba(37, 99, 235, 0.28)' : styles.primaryBtn.boxShadow,
            }}
            onMouseEnter={() => setHoverSignup(true)}
            onMouseLeave={() => setHoverSignup(false)}
          >
            Sign up
          </Link>
          <Link
            to="/login"
            style={{
              ...styles.outlineBtn,
              transform: hoverLogin ? 'scale(1.04)' : 'scale(1)',
              boxShadow: hoverLogin ? '0 6px 14px rgba(2, 6, 23, 0.12)' : styles.outlineBtn.boxShadow,
              background: hoverLogin ? '#eff6ff' : 'transparent',
            }}
            onMouseEnter={() => setHoverLogin(true)}
            onMouseLeave={() => setHoverLogin(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
