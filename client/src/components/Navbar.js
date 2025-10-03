import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
      backgroundColor: 'rgba(255,255,255,0.75)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    logo: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#111827',
      letterSpacing: '0.3px',
      userSelect: 'none',
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    link: {
      color: '#374151',
      textDecoration: 'none',
      fontSize: '14px',
      padding: '8px 10px',
      borderRadius: '6px',
      transition: 'background-color 150ms ease, color 150ms ease',
    },
    logoutBtn: {
      backgroundColor: '#f59e0b',
      border: 'none',
      color: '#111827',
      padding: '8px 12px',
      borderRadius: '6px',
      fontWeight: 600,
      cursor: 'pointer',
    },
  };

  const navItems = [
    { label: 'All Posts', to: '/posts' },
    { label: 'My Posts', to: '/myposts' },
    { label: 'Saved Posts', to: '/saved' },
    { label: 'Add Post', to: '/add' },
    { label: 'Profile', to: '/profile' },
  ];

  return (
    <nav style={styles.nav} className="nav-blur">
      <div style={styles.logo}>
        <Link to="/" style={{ ...styles.link, color: '#111827', padding: 0 }}>CampusHub</Link>
      </div>
      <div style={styles.right}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...styles.link,
              color: location.pathname === item.to ? '#111827' : '#374151',
              backgroundColor: location.pathname === item.to ? 'rgba(219,234,254,0.6)' : 'transparent',
            }}
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          style={styles.logoutBtn}
          onClick={() => {
            // Clear stored auth and navigate to login
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
