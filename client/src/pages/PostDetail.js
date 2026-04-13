import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.POSTS}/${id}`);
        if (!res.ok) throw new Error('Failed to load post');
        const data = await res.json();
        setPost(data);
      } catch (e) {
        setError(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const styles = {
    container: { width: '86vw', maxWidth: '1200px', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    heroTitle: { fontSize: '28px', fontWeight: 900, color: '#111827', marginBottom: 6 },
    heroSub: { color: '#374151', fontSize: 14 },
    chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    chip: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#111827', borderRadius: 999, fontSize: 12, fontWeight: 600 },
    chipSuccess: { background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46' },
    chipDanger: { background: '#fef2f2', border: '1px solid #fecaca', color: '#7f1d1d' },
    chipMuted: { background: '#f8fafc', border: '1px solid #e5e7eb', color: '#111827' },
    layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginTop: 18 },
    card: { border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, background: '#fff' },
    sectionTitle: { fontWeight: 800, marginBottom: 10, color: '#111827' },
    list: { paddingLeft: '18px' },
    backLink: { display: 'inline-block', marginTop: '16px', textDecoration: 'none', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', color: '#111827' },
    tag: { display: 'inline-block', background: '#eef2ff', color: '#3730a3', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', marginRight: '6px' },
    timeline: { position: 'relative', marginTop: 6 },
    tlItem: { position: 'relative', paddingLeft: 28, marginBottom: 16 },
    tlLine: { position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: '#e5e7eb' },
    tlDot: { position: 'absolute', left: 2, top: 2, width: 12, height: 12, borderRadius: 999, background: '#6366f1', boxShadow: '0 0 0 3px #eef2ff' },
    tlHeader: { fontWeight: 700, marginBottom: 6 },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid transparent' },
    badgeEasy: { background: '#dcfce7', color: '#166534', borderColor: '#86efac' },
    badgeMedium: { background: '#fef9c3', color: '#92400e', borderColor: '#fde68a' },
    badgeHard: { background: '#fee2e2', color: '#7f1d1d', borderColor: '#fecaca' },
    aside: { display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 16, height: 'fit-content' },
    footer: { marginTop: 14, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8 },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>;
  if (!post) return <div>Not found</div>;

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div>
        <div style={styles.heroTitle}>{post.title}</div>
        <div style={styles.chips}>
          {post.company ? <span style={styles.chip}>Company: {post.company}</span> : null}
          {post.role ? <span style={styles.chip}>Role: {post.role}</span> : null}
          {post.statusVerdict ? (
            <span style={{ ...styles.chip, ...(post.statusVerdict === 'Selected' ? styles.chipSuccess : post.statusVerdict === 'Rejected' ? styles.chipDanger : styles.chipMuted) }}>
              Status: {post.statusVerdict}
            </span>
          ) : null}
          {post.yearBatch ? <span style={styles.chip}>Year: {post.yearBatch}</span> : null}
          {post.hiringType ? <span style={styles.chip}>Hiring: {post.hiringType}</span> : null}
          {typeof post.cgpaCutoff === 'number' ? <span style={styles.chip}>CGPA: {post.cgpaCutoff}</span> : null}
          {post.location ? (
            <span style={styles.chip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" stroke="#374151" strokeWidth="1.5" fill="#e5e7eb"/><circle cx="12" cy="11" r="2.5" fill="#374151"/></svg>
              {post.location}
            </span>
          ) : null}
          {post.interviewDate ? <span style={styles.chip}>Date: {new Date(post.interviewDate).toLocaleDateString()}</span> : null}
          {post.salary && post.salaryVisibility !== 'Private' ? <span style={styles.chip}>Salary: {post.salary}</span> : null}
        </div>
      </div>

      {/* Main + Sidebar */}
      <div style={styles.layout}>
        {/* Main column */}
        <div>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Overview</div>
            <div>{post.description}</div>
            {post.personalInsights ? (
              <div style={{ marginTop: 12 }}>
                <div style={styles.sectionTitle}>Personal Insights</div>
                <div>{post.personalInsights}</div>
              </div>
            ) : null}
          </div>

          {Array.isArray(post.rounds) && post.rounds.length > 0 ? (
            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={styles.sectionTitle}>Interview Timeline</div>
              <div style={styles.timeline}>
                <div style={styles.tlLine} />
                {post.rounds.map((r, idx) => (
                  <div key={idx} style={styles.tlItem}>
                    <div style={styles.tlDot} />
                    <div style={styles.tlHeader}>
                  {r.title || `Round ${idx + 1}`}{r.type ? ` • ${r.type}` : ''}
                  {r.difficulty ? (
                    <span style={{ marginLeft: 8, ...styles.badge, ...(r.difficulty === 'Easy' ? styles.badgeEasy : r.difficulty === 'Medium' ? styles.badgeMedium : styles.badgeHard) }}>{r.difficulty}</span>
                  ) : null}
                </div>
                    {Array.isArray(r.questions) && r.questions.length > 0 ? (
                      <ul style={styles.list}>
                        {r.questions.map((q, qi) => (
                          <li key={qi}>{q}</li>
                        ))}
                      </ul>
                    ) : null}
                    {r.notes ? (
                      <div style={{ marginTop: 6 }}><em>{r.notes}</em></div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            post.questionsAsked?.length ? (
              <div style={{ ...styles.card, marginTop: 16 }}>
                <div style={styles.sectionTitle}>Questions Asked</div>
                <ul style={styles.list}>
                  {post.questionsAsked.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            ) : null
          )}

          {post.tags?.length ? (
            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={styles.sectionTitle}>Tags</div>
              <div>
                {post.tags.map((t, i) => (
                  <span key={i} style={styles.tag}>#{t}</span>
                ))}
              </div>
            </div>
          ) : null}

          {post.topicTags?.length ? (
            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={styles.sectionTitle}>Topic Tags</div>
              <div>
                {post.topicTags.map((t, i) => (
                  <span key={i} style={styles.tag}>#{t}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div style={styles.footer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="#e5e7eb"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" fill="#e5e7eb"/></svg>
            {post.postAnonymously ? 'Posted anonymously' : (post.createdByName ? `Posted by ${post.createdByName}` : 'Posted')}
          </div>

          <Link to="/posts" style={{ ...styles.backLink, marginTop: 16 }}>Back to All Posts</Link>
        </div>

        {/* Sidebar */}
        <aside style={styles.aside}>
          {post.preparationTips ? (
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5V5a2 2 0 0 1 2-2h9.5A2.5 2.5 0 0 1 18 5.5V20M4 19.5A1.5 1.5 0 0 0 5.5 21H18M4 19.5l14 1.5" stroke="#111827" strokeWidth="1.5"/></svg>
                  Preparation Tips
                </span>
              </div>
              <div>{post.preparationTips}</div>
            </div>
          ) : null}

          {post.mistakesLessons ? (
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4m0 4h.01M10.29 3.86 2.82 17.14A2 2 0 0 0 4.55 20h14.9a2 2 0 0 0 1.73-2.86L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="#b45309" strokeWidth="1.5"/></svg>
                  Mistakes to Avoid
                </span>
              </div>
              <div>{post.mistakesLessons}</div>
            </div>
          ) : null}

          {post.resources?.length ? (
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Resources</div>
              <ul style={styles.list}>
                {post.resources.map((r, i) => (
                  <li key={i}>
                    <a href={r} target="_blank" rel="noreferrer">{r}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default PostDetail;
