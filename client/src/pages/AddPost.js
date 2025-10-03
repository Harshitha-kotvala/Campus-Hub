import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPost = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

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

  const LoginPrompt = () => (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
      <div style={{ maxWidth: 'clamp(420px, 46vw, 820px)', width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, boxShadow: '0 12px 30px rgba(2,6,23,0.06), 0 4px 12px rgba(2,6,23,0.04)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Login required</div>
        <div style={{ color: '#4b5563', marginBottom: 16 }}>Please login to add a new post.</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/login', { state: { from: '/add' } })}
            style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '8px 12px', background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setSubmitting(true);
      const stored = localStorage.getItem('user');
      let owner = {};
      if (stored) {
        try {
          const u = JSON.parse(stored);
          owner = { createdByEmail: u.email, createdByName: u.name };
        } catch (_e) {}
      }
      // Map UI fields to backend schema
      const body = {
        title,
        description,
        company: companyName,
        role,
        interviewType,
        questionsAsked: questions
          .split('\n')
          .map(q => q.trim())
          .filter(Boolean),
        preparationTips,
        difficulty: difficulty || undefined,
        experience: experience || undefined,
        numberOfRounds: numberOfRounds ? Number(numberOfRounds) : undefined,
        numberOfProblems: numberOfProblems ? Number(numberOfProblems) : undefined,
        personalInsights: description,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        ...owner,
      };
      // Include JWT token if present (e.g., saved during login)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
      await axios.post('/api/posts', body, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      // Clear form on success
      setTitle('');
      setDescription('');
      setCompanyName('');
      setRole('');
      setInterviewType('');
      setQuestions('');
      setPreparationTips('');
      setDifficulty('');
      setExperience('');
      setNumberOfRounds('');
      setNumberOfProblems('');
      setTags('');
      setSuccessMsg('Post submitted! Redirecting to My Posts...');
      // Navigate to My Posts after a short delay so user sees the success
      setTimeout(() => navigate('/myposts', { state: { flash: 'Post submitted successfully' } }), 600);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error creating post';
      setErrorMsg(msg);
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add Post</h1>
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
          <textarea style={styles.textarea} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder={"Eg.\nTell me about yourself\nExplain closures in JS"} />
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
        <button type="submit" style={styles.button} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default AddPost;
