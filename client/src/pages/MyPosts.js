import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const MyPosts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(location.state?.flash || '');
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
        <div style={{ color: '#4b5563', marginBottom: 16 }}>Please login to view your posts.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/login', { state: { from: '/myposts' } })}
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
    if (flash) {
      const t = setTimeout(() => setFlash(''), 2500);
      return () => clearTimeout(t);
    }
  }, [flash]);

  useEffect(() => {
    const loadMine = async () => {
      if (!currentEmail) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/posts?createdByEmail=${encodeURIComponent(currentEmail)}`);
        if (!res.ok) throw new Error('Failed to load my posts');
        const data = await res.json();
        setPosts(data || []);
      } catch (e) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    loadMine();
  }, [currentEmail]);

  const handleDelete = async (post) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to delete');
      setPosts((prev) => prev.filter((x) => x._id !== post._id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  if (loading) return <div className="container" style={{ padding: '24px 16px' }}>Loading your posts...</div>;
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
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>You haven't posted yet</div>
      <div style={{ color: '#6b7280', marginBottom: 12 }}>Share your first interview experience and help your peers 🚀</div>
      <button className="btn btn-primary" onClick={() => navigate('/add')}>Create your first post</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.title}>My Posts</div>
        <div style={styles.helper}>Manage and edit your shared interview experiences.</div>
      </header>
      {flash ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 12px', borderRadius: '8px', marginBottom: 12 }}>
          {flash}
        </div>
      ) : null}
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={styles.list}>
          {posts.map((p) => (
            <PostCard
              key={p._id}
              post={p}
              isOwner={true}
              onEdit={(post) => navigate(`/posts/${post._id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
