import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, isOwner = false, onEdit, onDelete, onSave, onView }) => {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = {
    card: { position: 'relative', padding: '14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: hover ? '0 8px 20px rgba(2,6,23,0.08)' : '0 2px 6px rgba(2,6,23,0.06)', transition: 'transform 160ms ease, box-shadow 160ms ease', transform: hover ? 'scale(1.01)' : 'none' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    headLeft: { display: 'flex', flexDirection: 'column' },
    compRole: { fontSize: '13px', fontWeight: 600, color: '#6b7280' },
    outcomeBadge: (status) => ({ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid', background: status === 'Selected' ? '#ecfdf5' : status === 'Rejected' ? '#ffe4e6' : '#f8fafc', color: status === 'Selected' ? '#047857' : status === 'Rejected' ? '#be123c' : '#111827', borderColor: status === 'Selected' ? '#a7f3d0' : status === 'Rejected' ? '#fecdd3' : '#e5e7eb' }),
    title: { fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: 2 },
    metaRow: { color: '#6b7280', fontSize: '12px', marginTop: '6px' },
    desc: { marginTop: '8px', color: '#374151', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    tagsWrap: { marginTop: '10px' },
    actions: { display: 'flex', gap: '8px', alignItems: 'center' },
    moreBtn: { padding: 6, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', cursor: 'pointer' },
    menu: { position: 'absolute', right: 10, top: 42, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 12px 30px rgba(2,6,23,0.06), 0 4px 12px rgba(2,6,23,0.04)', zIndex: 10, minWidth: 140 },
    menuItem: { width: '100%', textAlign: 'left', padding: '8px 10px', background: '#fff', border: 'none', cursor: 'pointer' },
    saveBtn: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#065f46', cursor: 'pointer' },
    viewBtn: { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#111827', background: '#fff', cursor: 'pointer' },
    viewBtnHover: { background: '#f8fafc' },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.header}>
        <div style={styles.headLeft}>
          <div style={styles.compRole}>
            {post.company || '—'}{post.role ? ` • ${post.role}` : ''}
          </div>
          <div style={styles.title}>{post.title}</div>
          <div style={styles.metaRow}>
            {[
              typeof post.numberOfRounds === 'number' ? `${post.numberOfRounds} Rounds` : null,
              typeof post.numberOfProblems === 'number' ? `${post.numberOfProblems} Problems` : null,
              post.yearBatch || null,
              post.location || null,
            ].filter(Boolean).join(' • ')}
          </div>
        </div>
        <div style={styles.actions}>
          {post.statusVerdict ? (
            <span style={styles.outcomeBadge(post.statusVerdict)}>{post.statusVerdict}</span>
          ) : null}
          {onSave && (
            <button style={styles.saveBtn} onClick={() => onSave(post)}>Save</button>
          )}
          {isOwner && (
            <div style={{ position: 'relative' }}>
              <button style={styles.moreBtn} onClick={() => setMenuOpen(v => !v)} aria-label="More actions">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="5" r="2" fill="#6b7280"/><circle cx="12" cy="12" r="2" fill="#6b7280"/><circle cx="12" cy="19" r="2" fill="#6b7280"/></svg>
              </button>
              {menuOpen && (
                <div style={styles.menu} onMouseLeave={() => setMenuOpen(false)}>
                  <button style={styles.menuItem} onClick={() => { setMenuOpen(false); onEdit && onEdit(post); }}>Edit</button>
                  <button style={styles.menuItem} onClick={() => { setMenuOpen(false); onDelete && onDelete(post); }}>Delete</button>
                </div>
              )}
            </div>
          )}
          {onView ? (
            <button style={styles.viewBtn} onMouseEnter={(e)=>Object.assign(e.currentTarget.style, styles.viewBtnHover)} onMouseLeave={(e)=>{e.currentTarget.style.background = styles.viewBtn.background;}} onClick={() => onView(post)}>View Details</button>
          ) : (
            <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', ...styles.viewBtn }} onMouseEnter={(e)=>Object.assign(e.currentTarget.style, styles.viewBtnHover)} onMouseLeave={(e)=>{e.currentTarget.style.background = styles.viewBtn.background;}}>View Details</Link>
          )}
        </div>
      </div>
      <div style={styles.desc}>{post.description}</div>
      <div style={styles.tagsWrap}>
        {(post.tags || []).map((t, idx) => (
          <span key={idx} className="tag">#{t}</span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
