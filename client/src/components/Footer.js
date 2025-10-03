import React from 'react';

const Footer = () => {
  const styles = {
    container: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#111827', // dark background
      color: '#ffffff', // white text
      textAlign: 'center',
      padding: '12px 16px',
      fontSize: '14px',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  };

  return (
    <footer style={styles.container}>
      © svecw CampusHub. All rights reserved.
    </footer>
  );
};

export default Footer;
