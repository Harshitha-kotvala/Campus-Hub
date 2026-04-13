import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      overflow: 'hidden',
      background: '#fdf6ff',
    }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {[
          { w: 360, h: 360, top: -80, left: -80, bg: '#fce7f3', op: 0.7 },
          { w: 400, h: 400, bottom: -100, right: -100, bg: '#ede9fe', op: 0.6 },
          { w: 240, h: 240, top: -60, right: 80, bg: '#e0f2fe', op: 0.5 },
          { w: 280, h: 280, bottom: -60, left: 60, bg: '#d1fae5', op: 0.4 },
          { w: 200, h: 200, bottom: 60, left: '50%', bg: '#fef3c7', op: 0.45 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.w, height: b.h,
            borderRadius: '50%',
            background: b.bg,
            opacity: b.op,
            top: b.top, bottom: b.bottom,
            left: b.left, right: b.right,
          }} />
        ))}
        {/* Floating dots */}
        {[
          { s: 60, top: '30%', left: '8%', bg: '#fbcfe8' },
          { s: 40, top: '20%', right: '12%', bg: '#c4b5fd' },
          { s: 30, top: '60%', left: '15%', bg: '#6ee7b7' },
          { s: 50, top: '40%', right: '6%', bg: '#fde68a' },
          { s: 36, bottom: '20%', left: '45%', bg: '#a5f3fc' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: d.s, height: d.s,
            borderRadius: '50%',
            background: d.bg,
            opacity: 0.5,
            top: d.top, bottom: d.bottom,
            left: d.left, right: d.right,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

        {/* Hero text */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: '#fce7f3',
            color: '#9d174d',
            borderRadius: 100,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 14,
            border: '0.5px solid #fbcfe8',
          }}>✦ Exclusively for students</span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.2, marginBottom: 10 }}>
            Welcome to{' '}
            <span style={{ color: '#7c3aed' }}>CampusHub</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Your bridge from preparation to your dream career. Real interview experiences, real students, real results.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 18, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Login card */}
          <div style={{
            flex: 1, minWidth: 260, maxWidth: 360,
            background: 'rgba(255,255,255,0.88)',
            border: '0.5px solid #e9d5ff',
            borderRadius: 20,
            padding: '28px 24px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 18 }}>🔑</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e1b4b', marginBottom: 8 }}>Already have an account?</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.65, marginBottom: 20 }}>
              Log in and keep exploring interview experiences from top companies shared by students like you.
            </p>
            <Link to="/login" style={{
              display: 'inline-block', padding: '9px 22px', borderRadius: 100,
              fontSize: '0.87rem', fontWeight: 600, textDecoration: 'none',
              border: '1.5px solid #a78bfa', color: '#7c3aed', background: 'transparent',
            }}>Login here</Link>
          </div>

          {/* Signup card */}
          <div style={{
            flex: 1, minWidth: 260, maxWidth: 360,
            background: 'rgba(255,255,255,0.88)',
            border: '0.5px solid #e9d5ff',
            borderRadius: 20,
            padding: '28px 24px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 18 }}>🌟</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e1b4b', marginBottom: 8 }}>New to CampusHub?</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.65, marginBottom: 20 }}>
              Sign up with your college email and join thousands of students on their journey to career success.
            </p>
            <Link to="/signup" style={{
              display: 'inline-block', padding: '9px 22px', borderRadius: 100,
              fontSize: '0.87rem', fontWeight: 600, textDecoration: 'none',
              background: 'linear-gradient(135deg, #c084fc, #818cf8)',
              color: '#fff', border: 'none',
            }}>Get Started</Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.85)',
          border: '0.5px solid #e9d5ff',
          borderRadius: 16,
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}>
          {[
            { n: '500+', l: 'Experiences' },
            { n: '100+', l: 'Companies' },
            { n: '1000+', l: 'Students' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: '14px 32px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '0.5px solid #e9d5ff' : 'none',
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#7c3aed' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GetStarted;