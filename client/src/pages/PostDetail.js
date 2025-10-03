import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
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
    container: { width: '75vw', maxWidth: '1400px', minWidth: '680px', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    title: { fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '8px' },
    meta: { color: '#6b7280', marginBottom: '12px' },
    sectionTitle: { fontWeight: 700, marginTop: '12px', marginBottom: '6px', color: '#111827' },
    list: { paddingLeft: '18px' },
    backLink: { display: 'inline-block', marginTop: '16px', textDecoration: 'none', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: '6px', color: '#111827' },
    tag: { display: 'inline-block', background: '#eef2ff', color: '#3730a3', padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', marginRight: '6px' },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>;
  if (!post) return <div>Not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.title}>{post.title}</div>
      <div style={styles.meta}>
        {post.company ? `Company: ${post.company}` : '—'}
        {post.role ? ` • Role: ${post.role}` : ''}
        {post.interviewType ? ` • Type: ${post.interviewType}` : ''}
        {post.difficulty ? ` • Difficulty: ${post.difficulty}` : ''}
      </div>

      <div>
        <div style={styles.sectionTitle}>Description</div>
        <div>{post.description}</div>
      </div>

      {post.questionsAsked?.length ? (
        <div>
          <div style={styles.sectionTitle}>Questions Asked</div>
          <ul style={styles.list}>
            {post.questionsAsked.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {post.preparationTips ? (
        <div>
          <div style={styles.sectionTitle}>Preparation Tips</div>
          <div>{post.preparationTips}</div>
        </div>
      ) : null}

      {post.personalInsights ? (
        <div>
          <div style={styles.sectionTitle}>Personal Insights</div>
          <div>{post.personalInsights}</div>
        </div>
      ) : null}

      {post.tags?.length ? (
        <div style={{ marginTop: '10px' }}>
          {post.tags.map((t, i) => (
            <span key={i} style={styles.tag}>#{t}</span>
          ))}
        </div>
      ) : null}

      <Link to="/posts" style={styles.backLink}>Back to All Posts</Link>
    </div>
  );
};

export default PostDetail;
