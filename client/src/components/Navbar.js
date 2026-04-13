import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginHover, setLoginHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);
  
  // Check authentication state
  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('authToken'));
  
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 150ms ease',
      position: 'relative',
    },
    activeLink: {
      color: '#2563eb',
      textDecoration: 'none',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 150ms ease',
      position: 'relative',
    },
    logoutBtn: {
      backgroundColor: '#6b7280',
      border: '1px solid #e5e7eb',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '10px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 150ms ease',
    },
    loginBtn: {
      backgroundColor: '#3b82f6',
      border: 'none',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '10px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    loginBtnHover: {
      backgroundColor: '#2563eb',
      boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
      transform: 'translateY(-1px)',
    },
    signupBtn: {
      backgroundColor: '#fff',
      border: '1px solid #2563eb',
      color: '#2563eb',
      padding: '8px 16px',
      borderRadius: '10px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    signupBtnHover: {
      backgroundColor: '#eff6ff',
      borderColor: '#2563eb',
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
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={{ ...styles.link, color: '#111827', padding: 0 }}>CampusHub</Link>
      </div>
      <div style={styles.right}>
        {isLoggedIn ? (
          <>
            {/* Authenticated user - show full navigation */}
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={location.pathname === item.to ? styles.activeLink : styles.link}
              >
                {item.label}
                {location.pathname === item.to && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '12px',
                    right: '12px',
                    height: '2px',
                    background: '#2563eb',
                    borderRadius: '1px'
                  }} />
                )}
              </Link>
            ))}
            <button
              type="button"
              style={styles.logoutBtn}
              onClick={() => {
                // Clear stored auth and navigate to login
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Non-authenticated user - show only Login and Sign Up */}
            <Link 
              to="/login" 
              style={{
                ...styles.loginBtn,
                ...(location.pathname === '/login' ? { backgroundColor: '#1d4ed8' } : {}),
                ...(loginHover ? styles.loginBtnHover : {})
              }}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              style={{
                ...styles.signupBtn,
                ...(location.pathname === '/signup' ? { backgroundColor: '#f1f5f9', borderColor: '#2563eb', color: '#2563eb' } : {}),
                ...(signupHover ? styles.signupBtnHover : {})
              }}
              onMouseEnter={() => setSignupHover(true)}
              onMouseLeave={() => setSignupHover(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
