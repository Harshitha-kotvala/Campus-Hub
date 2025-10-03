import React from 'react';

const NotFound = () => {
  const styles = {
    container: { textAlign: 'center', padding: '40px 16px' },
    title: { fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' },
    subtitle: { color: '#6b7280' },
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.subtitle}>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
