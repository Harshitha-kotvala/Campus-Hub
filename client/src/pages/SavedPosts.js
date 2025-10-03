import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const SavedPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let currentEmail = '';
  if (stored) {
    try { currentEmail = JSON.parse(stored).email || ''; } catch {}
  }

  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('authToken'));

  const LoginPrompt = () => (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
      <div style={{ maxWidth: 640, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, boxShadow: '0 12px 30px rgba(2,6,23,0.06), 0 4px 12px rgba(2,6,23,0.04)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Login required</div>
        <div style={{ color: '#4b5563', marginBottom: 16 }}>Please login to view your saved posts.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/login', { state: { from: '/saved' } })}
            style={{ padding: '10px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 14px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  useEffect(() => {
    const loadSaved = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch('/api/posts/saved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          console.error('Saved posts request failed', { status: res.status, body: errText });
          let msg = 'Failed to load saved posts';
          try { const json = JSON.parse(errText); if (json?.message) msg = json.message; } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    loadSaved();
  }, [currentEmail]);

  // currentEmail is derived from localStorage user. If missing but isLoggedIn, proceed; else handled by prompt above.
  if (loading) return <div className="container" style={{ padding: '24px 16px' }}>Loading saved posts...</div>;
  if (error) return <div className="container" style={{ color: 'crimson', padding: '24px 16px' }}>Error: {error}</div>;

  const styles = {
    page: { width: '75vw', maxWidth: '1400px', minWidth: '680px', margin: '0 auto', padding: '8px 24px 24px' },
    header: { margin: '8px 0 14px' },
    title: { fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' },
    helper: { color: '#6b7280', marginTop: 6 },
    list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  };

  const EmptyState = () => (
    <div className="card elevate" style={{ padding: 20, textAlign: 'center', marginTop: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>No saved posts yet</div>
      <div style={{ color: '#6b7280', marginBottom: 12 }}>Browse posts and save the useful ones for quick access ⭐</div>
      <button className="btn btn-primary" onClick={() => navigate('/posts')}>Explore posts</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.title}>Saved Posts</div>
        <div style={styles.helper}>Your bookmarked interview experiences in one place.</div>
      </header>
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={styles.list}>
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
