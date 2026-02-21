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
  const [showAICheatSheet, setShowAICheatSheet] = useState(false);
  const [aiCheatSheetData, setAiCheatSheetData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
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
    input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    select: { padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    inputFocus: { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
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

  const handleGenerateAICheatSheet = async () => {
    if (!filterCompany) return;
    setAiLoading(true);
    try {
      // Simulate processing delay
      await new Promise(r => setTimeout(r, 1200));
      const companyPosts = posts.filter(p => p.company === filterCompany);
      // Aggregate top 5 common questions from rounds
      const allQuestions = companyPosts.flatMap(p =>
        (p.rounds || []).flatMap(r => {
          // Split by common delimiters and clean up
            const raw = (r.questions || '').toString();
            return raw.split(/[\n•;–—]/).map(q => q.trim()).filter(q => q.length > 10);
          })
        );
      // Simple frequency count for demo (could be smarter in real AI)
      const freq = {};
      allQuestions.forEach(q => {
        freq[q] = (freq[q] || 0) + 1;
      });
      const top5Questions = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([q]) => q);
      // Compute average difficulty (1-5) from overallDifficulty if present
      const difficulties = companyPosts.map(p => p.overallDifficulty).filter(d => typeof d === 'number' && d >= 1 && d <= 5);
      const avgDifficulty = difficulties.length ? Math.round(difficulties.reduce((a, b) => a + b, 0) / difficulties.length * 10) / 10 : 0;
      // Synthesize a pro preparation tip from preparationTips
      const allTips = companyPosts.map(p => p.preparationTips).filter(Boolean).join(' ');
      const proTip = allTips.length > 80
        ? allTips.slice(0, 140) + '...'
        : 'Focus on practicing LeetCode Medium/Hard, study past experiences, and research recent product launches.';
      setAiCheatSheetData({
        company: filterCompany,
        top5Questions,
        avgDifficulty,
        proTip
      });
      setShowAICheatSheet(true);
    } catch (e) {
      alert('Failed to generate AI summary');
    } finally {
      setAiLoading(false);
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
            <div style={styles.field}>
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
            <div style={styles.field}>
              <label style={styles.label}>Company</label>
              <select style={{ ...styles.select, ...(companyFocused ? styles.inputFocus : {}) }} value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} onFocus={() => setCompanyFocused(true)} onBlur={() => setCompanyFocused(false)}>
                <option value="">All companies</option>
                {companyOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Outcome</label>
              <select style={{ ...styles.select, ...(outcomeFocused ? styles.inputFocus : {}) }} value={filterOutcome} onChange={(e) => setFilterOutcome(e.target.value)} onFocus={() => setOutcomeFocused(true)} onBlur={() => setOutcomeFocused(false)}>
                <option value="">Any</option>
                {outcomeOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Experience Level</label>
              <select style={{ ...styles.select, ...(experienceFocused ? styles.inputFocus : {}) }} value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} onFocus={() => setExperienceFocused(true)} onBlur={() => setExperienceFocused(false)}>
                <option value="">Any</option>
                {experienceOptions.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
            {filterCompany && (
              <button
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                  transition: 'all 160ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
                onClick={handleGenerateAICheatSheet}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></span>
                    Generating...
                  </>
                ) : (
                  <>
                    ✨ Generate AI Summary
                  </>
                )}
              </button>
            )}
            <div style={{ display: 'flex' }}>
              <button style={{ ...styles.secondaryBtn, width: '100%' }} onClick={() => { setSearch(''); setDebouncedSearch(''); setFilterCompany(''); setFilterOutcome(''); setFilterExperience(''); }}>Clear Filters</button>
            </div>
          </aside>

          {/* Main Feed */}
          <main>
            {(debouncedSearch.trim() || filterCompany || filterOutcome || filterExperience) && (
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
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
      {showAICheatSheet && aiCheatSheetData && (
        <div style={styles.modalOverlay} onClick={() => setShowAICheatSheet(false)}>
          <div style={{ ...styles.modal, maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>✨ AI Cheat Sheet: {aiCheatSheetData.company}</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Top 5 Common Questions</div>
              <ol style={{ paddingLeft: 20, marginBottom: 0, color: '#374151' }}>
                {aiCheatSheetData.top5Questions.length ? aiCheatSheetData.top5Questions.map((q, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{q}</li>
                )) : <li style={{ color: '#9ca3af' }}>No questions found</li>}
              </ol>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Average Difficulty</div>
              <div style={{ display: 'flex', gap: 4, fontSize: 20 }}>
                {[1,2,3,4,5].map(n => (
                  <span key={n} style={{ color: n <= Math.round(aiCheatSheetData.avgDifficulty) ? '#fbbf24' : '#e5e7eb' }}>
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>
                  ({aiCheatSheetData.avgDifficulty || 'N/A'} / 5)
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Pro Preparation Tip</div>
              <div style={{ color: '#374151', lineHeight: 1.6 }}>{aiCheatSheetData.proTip}</div>
            </div>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => setShowAICheatSheet(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
