import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, isOwner = false, onEdit, onDelete, onSave, onView }) => {
  const [hover, setHover] = useState(false);
  const styles = {
    card: { padding: '14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-sm)', transition: 'transform 160ms ease, box-shadow 160ms ease', transform: hover ? 'translateY(-2px)' : 'none' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '18px', fontWeight: 700, color: '#111827' },
    meta: { color: '#6b7280', fontSize: '14px', marginTop: '6px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    submeta: { color: '#6b7280', fontSize: '13px', marginTop: '4px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    tagsWrap: { marginTop: '10px' },
    actions: { display: 'flex', gap: '8px' },
    editBtn: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', color: '#3730a3', cursor: 'pointer' },
    deleteBtn: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fee2e2', color: '#991b1b', cursor: 'pointer' },
    saveBtn: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#065f46', cursor: 'pointer' },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{post.title}</div>
          <div style={styles.meta}>
            {post.company ? <span>🏢 {post.company}</span> : null}
            {post.difficulty ? <span>🧩 {post.difficulty}</span> : null}
            {post.experience ? <span>👩‍💻 {post.experience}</span> : null}
          </div>
          {(post.role || post.interviewType || post.numberOfRounds || post.numberOfProblems) && (
            <div style={styles.submeta}>
              {post.role ? <span>🎯 {post.role}</span> : null}
              {post.interviewType ? <span>🧭 {post.interviewType}</span> : null}
              {typeof post.numberOfRounds === 'number' ? <span>🗂️ {post.numberOfRounds} rounds</span> : null}
              {typeof post.numberOfProblems === 'number' ? <span>❓ {post.numberOfProblems} problems</span> : null}
            </div>
          )}
        </div>
        <div style={styles.actions}>
          {onSave && (
            <button style={styles.saveBtn} onClick={() => onSave(post)}>Save</button>
          )}
          {isOwner && (
            <>
              <button style={styles.editBtn} onClick={() => onEdit && onEdit(post)}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => onDelete && onDelete(post)}>Delete</button>
            </>
          )}
          {onView ? (
            <button
              style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#111827', background: '#fff', cursor: 'pointer' }}
              onClick={() => onView(post)}
            >
              View Details
            </button>
          ) : (
            <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#111827' }}>View Details</Link>
          )}
        </div>
      </div>
      <div style={{ marginTop: '6px', color: '#374151' }}>{post.description}</div>
      <div style={styles.tagsWrap}>
        {(post.tags || []).map((t, idx) => (
          <span key={idx} className="tag">#{t}</span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
