import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  const styles = {
    container: { maxWidth: '50vw', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    title: { fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '6px', textAlign: 'center' },
    subtitle: { color: '#6b7280', textAlign: 'center', marginBottom: '16px' },
    cardWrap: { display: 'grid', gap: '14px', gridTemplateColumns: '1fr', marginTop: '8px' },
    card: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardText: { maxWidth: '70%' },
    cta: { textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 700 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Get Started</div>
      <div style={styles.subtitle}>Choose an option to continue</div>

      <div style={styles.cardWrap}>
        <div style={styles.card}>
          <div style={styles.cardText}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Already have an account?</div>
            <div style={{ color: '#6b7280' }}>Login with your credentials and continue sharing and exploring interview experiences.</div>
          </div>
          <Link to="/login" style={styles.cta}>Login here</Link>
        </div>

        <div style={styles.card}>
          <div style={styles.cardText}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>New to CampusHub?</div>
            <div style={{ color: '#6b7280' }}>Sign up using your college email to join the community and start contributing.</div>
          </div>
          <Link to="/signup" style={styles.cta}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
