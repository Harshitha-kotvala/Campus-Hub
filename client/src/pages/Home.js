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
      gap: '8px',
      padding: '12px',
      // Subtle professional gradient background
      background: 'linear-gradient(135deg, #f1f5f9 0%, #f8fafc 50%, #eef2ff 100%)',
      borderRadius: '12px',
    },
    title: { fontSize: '28px', fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: '#fff', textAlign: 'center', letterSpacing: '-0.02em', padding: '4px 12px', borderRadius: '8px', display: 'inline-block' },
    subtitle: { fontSize: '15px', lineHeight: 1.6, color: '#64748b', textAlign: 'center', maxWidth: '720px' },
    // Larger, more prominent card with soft shadow
    ctaCard: { 
      width: '100%', 
      maxWidth: '760px', 
      marginTop: '4px', 
      border: '1px solid #e2e8f0', 
      background: '#fff', 
      borderRadius: '14px', 
      padding: '20px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'transform 200ms ease, box-shadow 200ms ease',
      transform: hoverSignup || hoverLogin ? 'translateY(-2px)' : 'none'
    },
    ctaTitle: { fontSize: '18px', fontWeight: 600, color: '#0f172a', textAlign: 'center', marginBottom: '8px' },
    ctaRow: { display: 'flex', justifyContent: 'center', gap: '12px' },
    // Base button styles with smooth hover animations
    primaryBtn: { textDecoration: 'none', padding: '10px 18px', borderRadius: '10px', background: '#2563eb', color: '#fff', fontWeight: 500, display: 'inline-block', transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.20)' },
    outlineBtn: { textDecoration: 'none', padding: '10px 18px', borderRadius: '10px', background: '#fff', color: '#0f172a', fontWeight: 500, border: '1px solid #cbd5e1', display: 'inline-block', transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease', boxShadow: '0 2px 8px rgba(2, 6, 23, 0.06)' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to CampusHub 🎓</h1>
      <p style={styles.subtitle}>Exclusively for students of Shri Vishnu Engineering College for Women</p>
      <div 
        style={styles.ctaCard}
        onMouseEnter={() => {
          setHoverSignup(true);
          setHoverLogin(true);
        }}
        onMouseLeave={() => {
          setHoverSignup(false);
          setHoverLogin(false);
        }}
      >
        <div style={styles.ctaTitle}>Join the Community</div>
        <div style={styles.ctaRow}>
          <Link
            to="/signup"
            style={{
              ...styles.primaryBtn,
              background: hoverSignup ? '#1d4ed8' : '#2563eb',
              boxShadow: hoverSignup ? '0 6px 16px rgba(37, 99, 235, 0.25)' : styles.primaryBtn.boxShadow,
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
              boxShadow: hoverLogin ? '0 4px 10px rgba(2, 6, 23, 0.08)' : styles.outlineBtn.boxShadow,
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
