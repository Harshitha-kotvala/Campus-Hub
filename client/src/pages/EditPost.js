import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [questions, setQuestions] = useState('');
  const [preparationTips, setPreparationTips] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [experience, setExperience] = useState('');
  const [numberOfRounds, setNumberOfRounds] = useState('');
  const [numberOfProblems, setNumberOfProblems] = useState('');
  const [tags, setTags] = useState('');

  const styles = {
    container: { maxWidth: 'clamp(520px, 48vw, 900px)', width: '100%', margin: '24px auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    title: { fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px', textAlign: 'center' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
    label: { fontSize: '14px', color: '#374151' },
    input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' },
    textarea: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '100px' },
    button: { width: '100%', padding: '10px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Medium-Hard'];
  const interviewTypes = ['Technical', 'HR', 'Managerial', 'System Design', 'Aptitude', 'Other'];
  const experienceOptions = ['0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'];

  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('authToken'));
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
        <div style={{ maxWidth: 420, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Login required</div>
          <div style={{ color: '#4b5563', marginBottom: 14 }}>Please login to edit this post.</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => navigate('/login', { state: { from: `/posts/${id}` } })} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Go to Login</button>
            <button onClick={() => navigate('/posts')} style={{ padding: '8px 12px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${id}`);
        const p = res.data;
        setTitle(p.title || '');
        setDescription(p.description || '');
        setCompanyName(p.company || '');
        setRole(p.role || '');
        setInterviewType(p.interviewType || '');
        setQuestions((p.questionsAsked || []).join('\n'));
        setPreparationTips(p.preparationTips || '');
        setDifficulty(p.difficulty || '');
        setExperience(p.experience || '');
        setNumberOfRounds(typeof p.numberOfRounds === 'number' ? String(p.numberOfRounds) : (p.numberOfRounds || ''));
        setNumberOfProblems(typeof p.numberOfProblems === 'number' ? String(p.numberOfProblems) : (p.numberOfProblems || ''));
        setTags((p.tags || []).join(', '));
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || e.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
      if (!token) throw new Error('Not authenticated');

      const body = {
        title,
        description,
        company: companyName,
        role,
        interviewType,
        questionsAsked: questions
          .split('\n')
          .map((q) => q.trim())
          .filter(Boolean),
        preparationTips,
        difficulty: difficulty || undefined,
        experience: experience || undefined,
        numberOfRounds: numberOfRounds ? Number(numberOfRounds) : undefined,
        numberOfProblems: numberOfProblems ? Number(numberOfProblems) : undefined,
        personalInsights: description,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await axios.put(`/api/posts/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMsg('Post updated successfully');
      setTimeout(() => navigate(`/posts/${id}`), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error updating post';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading post...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Post</h1>
      <form onSubmit={onSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input style={styles.input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Short Description & Personal Insights</label>
          <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share a brief overview and your personal insights (e.g., Don't panic...)" required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Company Name</label>
          <input style={styles.input} type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <input style={styles.input} type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Experience</label>
          <select style={styles.input} value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="">Select experience (optional)</option>
            {experienceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={styles.field}>
            <label style={styles.label}>Number of Rounds</label>
            <input style={styles.input} type="number" min="0" value={numberOfRounds} onChange={(e) => setNumberOfRounds(e.target.value)} placeholder="e.g., 1, 2, 3" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Number of Problems</label>
            <input style={styles.input} type="number" min="0" value={numberOfProblems} onChange={(e) => setNumberOfProblems(e.target.value)} placeholder="e.g., 1, 2, 3" />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Interview Type</label>
          <select style={styles.input} value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
            <option value="">Select interview type (optional)</option>
            {interviewTypes.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Questions (one per line)</label>
          <textarea style={styles.textarea} value={questions} onChange={(e) => setQuestions(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Preparation Tips</label>
          <textarea style={styles.textarea} value={preparationTips} onChange={(e) => setPreparationTips(e.target.value)} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Difficulty</label>
          <select
            style={styles.input}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select difficulty (optional)</option>
            {difficultyOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Tags</label>
          <input style={styles.input} type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., DSA, Arrays" />
        </div>
        {errorMsg && <div style={{ color: 'crimson', marginBottom: 10 }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'seagreen', marginBottom: 10 }}>{successMsg}</div>}
        <button type="submit" style={styles.button} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default EditPost;
