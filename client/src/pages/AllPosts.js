import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const AllPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');
  const [filterExperience, setFilterExperience] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const styles = {
    page: { width: '100%', background: '#f8fafc', minHeight: 'calc(100vh - 60px)' },
    container: { width: '86vw', maxWidth: '1200px', margin: '0 auto', padding: '8px 24px 24px' },
    header: { margin: '8px 0 14px' },
    title: { fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' },
    helper: { color: '#6b7280', marginTop: 6 },
    layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18, alignItems: 'start' },
    sidebar: { position: 'sticky', top: 16, background: '#fff', borderRight: '1px solid #e5e7eb', padding: 16, height: 'calc(100vh - 120px)' },
    sideTitle: { fontWeight: 800, color: '#111827', marginBottom: 10 },
    field: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 },
    label: { fontSize: 13, color: '#374151' },
    input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' },
    select: { padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' },
    list: { display: 'flex', flexDirection: 'column', gap: '16px' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center', zIndex: 1000 },
    modal: { maxWidth: 640, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, boxShadow: '0 12px 30px rgba(2,6,23,0.06), 0 4px 12px rgba(2,6,23,0.04)' },
    modalTitle: { fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 },
    modalText: { color: '#4b5563', marginBottom: 16 },
    actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
    primaryBtn: { padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
    secondaryBtn: { padding: '8px 12px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer' },
  };

  if (loading) return <div className="container" style={{ padding: '24px 16px' }}>Loading posts...</div>;
  if (error) return <div className="container" style={{ color: 'crimson', padding: '24px 16px' }}>Error: {error}</div>;

  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let currentEmail = '';
  if (stored) {
    try { currentEmail = JSON.parse(stored).email || ''; } catch {}
  }

  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('authToken'));

  const handleView = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
    }
  };

  const handleSave = async (post) => {
    try {
      if (!isLoggedIn) {
        setShowLoginPrompt(true);
        return;
      }
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
      const res = await fetch('/api/posts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ postId: post._id }),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Saved');
    } catch (e) {
      alert(e.message || 'Save failed');
    }
  };

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

  const EmptyState = () => (
    <div className="card elevate" style={{ padding: 20, textAlign: 'center', marginTop: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>No posts yet</div>
      <div style={{ color: '#6b7280', marginBottom: 12 }}>Be the first to share your interview experience and help your peers 🚀</div>
      <button className="btn btn-primary" onClick={() => navigate('/add')}>Add your first post</button>
    </div>
  );

  // derive companies list and filtered posts
  const companyOptions = Array.from(new Set(posts.map(p => p.company).filter(Boolean))).sort();
  const experienceOptions = ['Intern', 'FTE', 'New Grad'];
  const outcomeOptions = ['Selected', 'Rejected'];

  const matchesSearch = (p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.company || '').toLowerCase().includes(q) ||
      (p.role || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  };

  const matchesFilters = (p) => (
    (!filterCompany || p.company === filterCompany) &&
    (!filterOutcome || p.statusVerdict === filterOutcome) &&
    (!filterExperience || p.experience === filterExperience)
  );

  const filtered = posts.filter(p => matchesSearch(p) && matchesFilters(p));

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.title}>Latest Interview Experiences</div>
        <div style={styles.helper}>Discover insights from peers and prepare smarter for your next round.</div>
      </header>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={styles.layout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.sideTitle}>Search & Filters</div>
            <div style={styles.field}>
              <label style={styles.label}>Search</label>
              <input
                style={styles.input}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, company, role..."
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company</label>
              <select style={styles.select} value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
                <option value="">All companies</option>
                {companyOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Outcome</label>
              <select style={styles.select} value={filterOutcome} onChange={(e) => setFilterOutcome(e.target.value)}>
                <option value="">Any</option>
                {outcomeOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Experience Level</label>
              <select style={styles.select} value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)}>
                <option value="">Any</option>
                {experienceOptions.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...styles.primaryBtn, flex: 1 }} onClick={() => { /* no-op; reactive */ }}>Apply</button>
              <button style={{ ...styles.secondaryBtn, flex: 1 }} onClick={() => { setSearch(''); setFilterCompany(''); setFilterOutcome(''); setFilterExperience(''); }}>Reset</button>
            </div>
          </aside>

          {/* Main Feed */}
          <main>
            <div style={styles.list}>
              {filtered.map((p) => (
                <PostCard
                  key={p._id}
                  post={p}
                  isOwner={currentEmail && p.createdByEmail === currentEmail}
                  onEdit={(post) => navigate(`/posts/${post._id}/edit`)}
                  onDelete={handleDelete}
                  onSave={handleSave}
                  onView={isLoggedIn ? undefined : () => handleView()}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{
                  marginTop: 12,
                  padding: 20,
                  textAlign: 'center',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(2,6,23,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>No experiences found</div>
                  <div style={{ color: '#6b7280', marginBottom: 12 }}>Try adjusting your search or clear filters to see more results.</div>
                  <button
                    style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { setSearch(''); setFilterCompany(''); setFilterOutcome(''); setFilterExperience(''); }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {showLoginPrompt && (
        <div style={styles.modalOverlay} onClick={() => setShowLoginPrompt(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Login required</div>
            <div style={styles.modalText}>Please login to view post details.</div>
            <div style={styles.actions}>
              <button
                onClick={() => navigate('/login', { state: { from: '/posts' } })}
                style={styles.primaryBtn}
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
