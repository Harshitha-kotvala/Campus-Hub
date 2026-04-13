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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
  const [companyFocused, setCompanyFocused] = useState(false);
  const [outcomeFocused, setOutcomeFocused] = useState(false);
  const [experienceFocused, setExperienceFocused] = useState(false);

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

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const styles = {
    page: { width: '100%', background: 'transparent', minHeight: 'calc(100vh - 60px)' },
    container: { width: '100%', margin: '0', padding: '0' },
    header: { margin: '0 0 16px' },
    title: { fontSize: '28px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' },
    helper: { color: '#64748b', marginTop: 6, fontSize: '13px' },
    layout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' },
    sidebar: { position: 'sticky', top: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: 20, height: 'calc(100vh - 100px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    sideTitle: { fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: 12 },
    section: { marginBottom: 16 },
    separator: { height: '1px', background: '#e2e8f0', margin: '12px 0', border: 'none' },
    field: { marginBottom: 12 },
    label: { fontSize: '13px', color: '#64748b', marginBottom: 6, display: 'block' },
    input: { 
      padding: '10px 12px', 
      borderRadius: 8, 
      border: '1px solid #e5e7eb', 
      outline: 'none', 
      transition: 'border-color 160ms, box-shadow 160ms',
      width: '100%',
      maxWidth: '240px',
      minWidth: '240px',
      boxSizing: 'border-box',
      flex: '1 1 auto'
    }, 
    select: { 
      padding: '10px 12px', 
      borderRadius: 8, 
      border: '1px solid #e5e7eb', 
      background: '#fff', 
      outline: 'none', 
      transition: 'border-color 160ms, box-shadow 160ms',
      width: '100%',
      maxWidth: '240px',
      minWidth: '240px',
      boxSizing: 'border-box',
      flex: '1 1 auto'
    },
    inputFocus: { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center', zIndex: 1000 },
    modal: { maxWidth: 640, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    modalTitle: { fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: 10 },
    modalText: { fontSize: '15px', lineHeight: 1.6, color: '#64748b', marginBottom: 16 },
    actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
    primaryBtn: { padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 160ms ease, box-shadow 160ms ease' },
    secondaryBtn: { padding: '10px 18px', background: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 160ms ease, box-shadow 160ms ease' },
  };

  if (loading) return <div className="container" style={{ padding: '30px 16px' }}>Loading posts...</div>;
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
    const q = debouncedSearch.trim().toLowerCase();
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

  // Result count message
  const resultMessage = () => {
    const total = filtered.length;
    const query = debouncedSearch.trim();
    const parts = [];
    if (total === 0) return 'No experiences found';
    parts.push(`Found ${total} experience${total !== 1 ? 's' : ''}`);
    if (query) parts.push(`for "${query}"`);
    if (filterCompany) parts.push(`at ${filterCompany}`);
    return parts.join(' ');
  };

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
            
            {/* Search Section */}
            <div style={styles.section}>
              <label style={styles.label}>Search</label>
              <input
                style={{
                  ...styles.input,
                  ...(searchFocused ? styles.inputFocus : {})
                }}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search title, company, role..."
              />
            </div>

            <hr style={styles.separator} />

            {/* Company Section */}
            <div style={styles.section}>
              <label style={styles.label}>Company</label>
              <select style={{ ...styles.select, ...(companyFocused ? styles.inputFocus : {}) }} value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} onFocus={() => setCompanyFocused(true)} onBlur={() => setCompanyFocused(false)}>
                <option value="">All companies</option>
                {companyOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Outcome Section */}
            <div style={styles.section}>
              <label style={styles.label}>Outcome</label>
              <select style={{ ...styles.select, ...(outcomeFocused ? styles.inputFocus : {}) }} value={filterOutcome} onChange={(e) => setFilterOutcome(e.target.value)} onFocus={() => setOutcomeFocused(true)} onBlur={() => setOutcomeFocused(false)}>
                <option value="">Any</option>
                {outcomeOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Experience Section */}
            <div style={styles.section}>
              <label style={styles.label}>Experience Level</label>
              <select style={{ ...styles.select, ...(experienceFocused ? styles.inputFocus : {}) }} value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} onFocus={() => setExperienceFocused(true)} onBlur={() => setExperienceFocused(false)}>
                <option value="">Any</option>
                {experienceOptions.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>

            <hr style={styles.separator} />

            {/* Clear Filters Button */}
            <button
              style={{
                width: '100%',
                padding: '8px 16px',
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
              onClick={() => {
                setSearch('');
                setDebouncedSearch('');
                setFilterCompany('');
                setFilterOutcome('');
                setFilterExperience('');
              }}
            >
              Clear All Filters
            </button>
          </aside>
          <main style={styles.feed}>
            {(debouncedSearch.trim() || filterCompany || filterOutcome || filterExperience) && (
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: 8 }}>
                {resultMessage()}
              </div>
            )}
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
                  padding: 24,
                  textAlign: 'center',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
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
                    style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 160ms ease, box-shadow 160ms ease' }}
                    onClick={() => { setSearch(''); setDebouncedSearch(''); setFilterCompany(''); setFilterOutcome(''); setFilterExperience(''); }}
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
