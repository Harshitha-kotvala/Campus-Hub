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
  const [topicTags, setTopicTags] = useState('');
  const [statusVerdict, setStatusVerdict] = useState('');
  const [yearBatch, setYearBatch] = useState('');
  const [hiringType, setHiringType] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryVisibility, setSalaryVisibility] = useState('Public');
  const [location, setLocation] = useState('');
  const [cgpaCutoff, setCgpaCutoff] = useState('');
  const [resources, setResources] = useState('');
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [overallDifficulty, setOverallDifficulty] = useState(0);
  const [mistakesLessons, setMistakesLessons] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [addRoundHover, setAddRoundHover] = useState(false);

  // Validation functions for each step
  const validateStep1 = () => {
    const requiredFields = [title, description, companyName, role];
    const emptyFields = requiredFields.filter(field => !field || field.trim() === '');
    
    if (emptyFields.length > 0) {
      setErrorMsg('Please fill in all required fields: Title, Description, Company, and Role');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    const requiredFields = [interviewType, difficulty, experience];
    const emptyFields = requiredFields.filter(field => !field || field.trim() === '');
    
    if (emptyFields.length > 0) {
      setErrorMsg('Please fill in all required fields: Interview Type, Difficulty, and Experience');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep3 = () => {
    // Step 3 has no compulsory fields, all are optional
    setErrorMsg('');
    return true;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    switch(step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = false;
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };
  const [companyFocused, setCompanyFocused] = useState(false);
  const [roleFocused, setRoleFocused] = useState(false);
  const [experienceFocused, setExperienceFocused] = useState(false);
  const [hiringTypeFocused, setHiringTypeFocused] = useState(false);
  const [statusFocused, setStatusFocused] = useState(false);
  const [yearFocused, setYearFocused] = useState(false);
  const [roundTypeFocused, setRoundTypeFocused] = useState(false);
  const [difficultyFocused, setDifficultyFocused] = useState(false);
  const [questionsFocused, setQuestionsFocused] = useState(false);
  const [roundsNumberFocused, setRoundsNumberFocused] = useState(false);
  const [problemsFocused, setProblemsFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [cgpaFocused, setCgpaFocused] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [tipsFocused, setTipsFocused] = useState(false);
  const [mistakesFocused, setMistakesFocused] = useState(false);
  const [resourcesFocused, setResourcesFocused] = useState(false);

  const styles = {
    container: { width: '100%', maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    title: { fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', textAlign: 'center' },
    subtitle: { fontSize: '15px', lineHeight: 1.6, color: '#64748b', textAlign: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '12px 0 6px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' },
    label: { fontSize: '13px', color: '#64748b' },
    help: { fontSize: '13px', color: '#64748b' },
    input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    textarea: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '120px', fontSize: '15px', lineHeight: 1.6, outline: 'none', transition: 'border-color 160ms, box-shadow 160ms' },
    inputFocus: { borderColor: '#3b82f6', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)' },
    button: { width: '100%', padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 160ms ease, box-shadow 160ms ease' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
    roundBox: { border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10, background: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },
    roundHeader: { display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' },
    smallBtn: { padding: '6px 10px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, cursor: 'pointer' },
    progressWrap: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
    progressBarTrack: { width: '100%', height: 6, background: '#e5e7eb', borderRadius: 999 },
    progressBarFill: (step) => ({ width: `${((step - 1) / 2) * 100}%`, height: '100%', background: '#6366f1', borderRadius: 999, transition: 'width 200ms ease' }),
    progressLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', fontWeight: 600 },
    progressLabel: (active) => ({ color: active ? '#111827' : '#6b7280' }),
    navRow: { display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 },
    navBtn: { padding: '8px 14px', borderRadius: 999, background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 160ms ease', display: 'flex', alignItems: 'center', gap: 6 },
    addRoundBtn: (hover) => ({ padding: '6px 10px', border: hover ? '1px solid #2563eb' : '1px dashed #93c5fd', background: hover ? '#eff6ff' : '#fff', color: '#2563eb', borderRadius: 8, cursor: 'pointer', transition: 'all 160ms ease' }),
  };

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Medium-Hard'];
  const roundTypeOptions = ['OA', 'Technical', 'HR', 'Managerial'];
  const interviewTypes = ['Technical', 'HR', 'Managerial', 'System Design', 'Aptitude', 'Other'];
  const experienceOptions = ['Intern', 'FTE', 'New Grad'];
  const statusOptions = ['Selected', 'Rejected', 'Waitlisted'];
  const visibilityOptions = ['Public', 'Private'];
  const hiringTypes = ['On-Campus', 'Off-Campus', 'Referral'];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 13 }, (_, i) => String(currentYear - 6 + i));
  const companyOptions = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe',
    'Atlassian', 'Oracle', 'Salesforce', 'Uber', 'Airbnb', 'Bloomberg',
    'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'Deutsche Bank',
    'Accenture', 'Infosys', 'TCS', 'Wipro', 'PayPal', 'Stripe', 'LinkedIn'
  ];

  const [rounds, setRounds] = useState([]);

  const addRound = () => {
    setRounds((prev) => [
      ...prev,
      { type: '', questions: '', difficulty: '' },
    ]);
  };

  const removeRound = (idx) => {
    setRounds((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRound = (idx, key, value) => {
    setRounds((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

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

  useEffect(() => {
    const raw = localStorage.getItem('addPostDraftV1');
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      setTitle(d.title || '');
      setDescription(d.description || '');
      setCompanyName(d.companyName || '');
      setRole(d.role || '');
      setInterviewType(d.interviewType || '');
      setHiringType(d.hiringType || '');
      setInterviewDate(d.interviewDate || '');
      setQuestions(d.questions || '');
      setPreparationTips(d.preparationTips || '');
      setDifficulty(d.difficulty || '');
      setExperience(d.experience || '');
      setNumberOfRounds(d.numberOfRounds || '');
      setNumberOfProblems(d.numberOfProblems || '');
      setTags(d.tags || '');
      setTopicTags(d.topicTags || '');
      setStatusVerdict(d.statusVerdict || '');
      setYearBatch(d.yearBatch || '');
      setSalary(d.salary || '');
      setSalaryVisibility(d.salaryVisibility || 'Public');
      setLocation(d.location || '');
      setCgpaCutoff(d.cgpaCutoff || '');
      setResources(d.resources || '');
      setPostAnonymously(!!d.postAnonymously);
      setOverallDifficulty(Number(d.overallDifficulty || 0));
      setMistakesLessons(d.mistakesLessons || '');
      if (Array.isArray(d.rounds) && d.rounds.length) setRounds(d.rounds);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const draft = {
        title,
        description,
        companyName,
        role,
        interviewType,
        hiringType,
        interviewDate,
        questions,
        preparationTips,
        difficulty,
        experience,
        numberOfRounds,
        numberOfProblems,
        tags,
        topicTags,
        statusVerdict,
        yearBatch,
        salary,
        salaryVisibility,
        location,
        cgpaCutoff,
        resources,
        postAnonymously,
        overallDifficulty,
        mistakesLessons,
        rounds,
      };
      localStorage.setItem('addPostDraftV1', JSON.stringify(draft));
    }, 500);
    return () => clearTimeout(t);
  }, [title, description, companyName, role, interviewType, hiringType, interviewDate, questions, preparationTips, difficulty, experience, numberOfRounds, numberOfProblems, tags, topicTags, statusVerdict, yearBatch, salary, salaryVisibility, location, cgpaCutoff, resources, postAnonymously, overallDifficulty, mistakesLessons, rounds]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setSubmitting(true);
      // Lightweight client-side validation to guide the user
      const t = title.trim();
      const d = description.trim();
      if (!t || t.length < 5) {
        setErrorMsg('Please provide a meaningful title (at least 5 characters).');
        setSubmitting(false);
        return;
      }
      if (!d || d.length < 20) {
        setErrorMsg('Please add a short description with your insights (at least 20 characters).');
        setSubmitting(false);
        return;
      }
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
        hiringType: hiringType || undefined,
        interviewDate: interviewDate || undefined,
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
        topicTags: topicTags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        resources: (resources || '')
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean),
        rounds: (rounds || []).map((r) => ({
          type: r.type?.trim() || undefined,
          difficulty: r.difficulty || undefined,
          questions: (r.questions || '')
            .split('\n')
            .map(q => q.trim())
            .filter(Boolean),
        })),
        statusVerdict: statusVerdict || undefined,
        yearBatch: yearBatch || undefined,
        salary: salary || undefined,
        salaryVisibility: salary ? salaryVisibility : undefined,
        location: location || undefined,
        cgpaCutoff: cgpaCutoff !== '' ? Number(cgpaCutoff) : undefined,
        postAnonymously: !!postAnonymously,
        overallDifficulty: overallDifficulty ? Number(overallDifficulty) : undefined,
        mistakesLessons: mistakesLessons || undefined,
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
      setTopicTags('');
      setRounds([{ type: '', questions: '', difficulty: '' }]);
      setStatusVerdict('');
      setYearBatch('');
      setHiringType('');
      setInterviewDate('');
      setSalary('');
      setSalaryVisibility('Public');
      setLocation('');
      setCgpaCutoff('');
      setResources('');
      setPostAnonymously(false);
      setOverallDifficulty(0);
      setMistakesLessons('');
      setRounds([]);
      localStorage.removeItem('addPostDraftV1');
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
      <div style={styles.subtitle}>Share your interview experience to help others prepare better.</div>
      <div style={styles.progressWrap}>
        <div style={styles.progressBarTrack}>
          <div style={styles.progressBarFill(step)} />
        </div>
        <div style={styles.progressLabels}>
          <span style={styles.progressLabel(step === 1)}>Basics</span>
          <span style={styles.progressLabel(step === 2)}>Rounds</span>
          <span style={styles.progressLabel(step === 3)}>Reflection</span>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        {step === 1 && (
        <>
        <div style={styles.sectionTitle}>Basic Details</div>
        <div style={styles.field}>
          <label style={styles.label}>Company Name <span style={{ color: '#EF4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
              {/* building icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21h18M5 21V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M9 21v-4h2v4M13 21v-4h2v4M9 9h2M13 9h2M9 13h2M13 13h2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              style={{ ...styles.input, paddingLeft: 36, ...(companyFocused ? styles.inputFocus : {}) }}
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              list="companyList"
              placeholder="Enter the company name (e.g., Atlassian, Microsoft)"
              onFocus={() => setCompanyFocused(true)}
              onBlur={() => setCompanyFocused(false)}
              required
            />
            <datalist id="companyList">
              {companyOptions.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
          <div style={styles.help}>Use the official company name to help others find your post.</div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Role <span style={{ color: '#EF4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
              {/* user icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="#6b7280"/>
              </svg>
            </span>
            <input
              style={{ ...styles.input, paddingLeft: 36, ...(roleFocused ? styles.inputFocus : {}) }}
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Software Engineering Intern (Summer 2025)"
              onFocus={() => setRoleFocused(true)}
              onBlur={() => setRoleFocused(false)}
              required
            />
          </div>
          <div style={styles.help}>Be specific with role and season if applicable.</div>
        </div>
        
        <div style={styles.grid3}>
          <div style={styles.field}>
            <label style={styles.label}>Experience Level</label>
            <select style={{ ...styles.input, ...(experienceFocused ? styles.inputFocus : {}) }} value={experience} onChange={(e) => setExperience(e.target.value)} onFocus={() => setExperienceFocused(true)} onBlur={() => setExperienceFocused(false)}>
              <option value="">Select experience (optional)</option>
              {experienceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Interview Type</label>
            <select style={{ ...styles.input, ...(hiringTypeFocused ? styles.inputFocus : {}) }} value={hiringType} onChange={(e) => setHiringType(e.target.value)} onFocus={() => setHiringTypeFocused(true)} onBlur={() => setHiringTypeFocused(false)}>
              <option value="">Select interview type (optional)</option>
              {hiringTypes.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Outcome</label>
            <select style={{ ...styles.input, ...(statusFocused ? styles.inputFocus : {}) }} value={statusVerdict} onChange={(e) => setStatusVerdict(e.target.value)} onFocus={() => setStatusFocused(true)} onBlur={() => setStatusFocused(false)}>
              <option value="">Select verdict (optional)</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Year / Batch</label>
          <select style={{ ...styles.input, ...(yearFocused ? styles.inputFocus : {}) }} value={yearBatch} onChange={(e) => setYearBatch(e.target.value)} onFocus={() => setYearFocused(true)} onBlur={() => setYearFocused(false)}>
            <option value="">Select year (optional)</option>
            {yearOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        </>
        )}

        {step === 2 && (
        <>
        <div style={styles.sectionTitle}>Rounds</div>
        <div>
          {rounds.length > 0 && rounds.map((r, idx) => (
            <div key={idx} style={styles.roundBox}>
              <div style={styles.roundHeader}>
                <div style={{ fontWeight: 700 }}>Round {idx + 1}</div>
                <button type="button" style={styles.smallBtn} onClick={() => removeRound(idx)}>Remove</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div style={styles.field}>
                  <label style={styles.label}>Round Type</label>
                  <select style={{ ...styles.input, ...(roundTypeFocused ? styles.inputFocus : {}) }} value={r.type} onChange={(e) => updateRound(idx, 'type', e.target.value)} onFocus={() => setRoundTypeFocused(true)} onBlur={() => setRoundTypeFocused(false)}>
                    <option value="">Select type</option>
                    {roundTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Difficulty</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { key: 'Easy', bg: '#dcfce7', border: '#86efac', text: '#166534' },
                      { key: 'Medium', bg: '#fef9c3', border: '#fde68a', text: '#92400e' },
                      { key: 'Hard', bg: '#fee2e2', border: '#fecaca', text: '#7f1d1d' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateRound(idx, 'difficulty', opt.key)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: `1px solid ${opt.border}`,
                          background: r.difficulty === opt.key ? opt.bg : '#fff',
                          color: opt.text,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        aria-pressed={r.difficulty === opt.key}
                      >
                        {opt.key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={styles.field}>
                  <label style={styles.label}>Questions Asked (Markdown supported)</label>
                  <textarea
                    style={{ ...styles.textarea, ...(questionsFocused ? styles.inputFocus : {}) }}
                    value={r.questions}
                    onChange={(e) => updateRound(idx, 'questions', e.target.value)}
                    onFocus={() => setQuestionsFocused(true)}
                    onBlur={() => setQuestionsFocused(false)}
                    placeholder={"e.g.\nImplement LRU Cache\nSQL: top-N per group\nBehavioral: conflict resolution"}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            style={{ ...styles.addRoundBtn(addRoundHover), marginBottom: 12 }}
            onMouseEnter={() => setAddRoundHover(true)}
            onMouseLeave={() => setAddRoundHover(false)}
            onClick={addRound}
          >
            + Add Round
          </button>
        </div>

        
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Number of Rounds</label>
            <input
              style={{ ...styles.input, ...(roundsNumberFocused ? styles.inputFocus : {}) }}
              type="number"
              min="0"
              inputMode="numeric"
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(e.target.value)}
              placeholder="e.g., 2"
              onFocus={() => setRoundsNumberFocused(true)}
              onBlur={() => setRoundsNumberFocused(false)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Number of Problems</label>
            <input
              style={{ ...styles.input, ...(problemsFocused ? styles.inputFocus : {}) }}
              type="number"
              min="0"
              inputMode="numeric"
              value={numberOfProblems}
              onChange={(e) => setNumberOfProblems(e.target.value)}
              placeholder="e.g., 4"
              onFocus={() => setProblemsFocused(true)}
              onBlur={() => setProblemsFocused(false)}
            />
          </div>
        </div>
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Location</label>
            <input
              style={{ ...styles.input, ...(locationFocused ? styles.inputFocus : {}) }}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or Remote (e.g., Bengaluru, Hyderabad, Remote)"
              onFocus={() => setLocationFocused(true)}
              onBlur={() => setLocationFocused(false)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>CGPA Cutoff</label>
            <input
              style={{ ...styles.input, ...(cgpaFocused ? styles.inputFocus : {}) }}
              type="number"
              min="0"
              max="10"
              step="0.01"
              inputMode="decimal"
              value={cgpaCutoff}
              onChange={(e) => setCgpaCutoff(e.target.value)}
              placeholder="e.g., 7.5"
              onFocus={() => setCgpaFocused(true)}
              onBlur={() => setCgpaFocused(false)}
            />
          </div>
        </div>
        </>
        )}
        {step === 3 && (
        <>
        <div style={styles.sectionTitle}>Reflection</div>
        <div style={styles.field}>
          <label style={styles.label}>Title <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            style={{ ...styles.input, ...(titleFocused ? styles.inputFocus : {}) }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My ABC Corp SDE Interview Experience"
            minLength={5}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Short Description & Personal Insights <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea
            style={{ ...styles.textarea, ...(descriptionFocused ? styles.inputFocus : {}) }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the overall process and what you learned or would do differently."
            minLength={20}
            onFocus={() => setDescriptionFocused(true)}
            onBlur={() => setDescriptionFocused(false)}
            required
          />
        </div>
        

        <div style={styles.sectionTitle}>The Advice</div>
        <div style={styles.field}>
          <label style={styles.label}>Preparation Tips</label>
          <textarea
            style={{ ...styles.textarea, ...(tipsFocused ? styles.inputFocus : {}) }}
            value={preparationTips}
            onChange={(e) => setPreparationTips(e.target.value)}
            placeholder="Share what actually helped you prepare (study plan, mock interviews, must-do topics)."
            onFocus={() => setTipsFocused(true)}
            onBlur={() => setTipsFocused(false)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Mistakes / Lessons</label>
          <textarea
            style={{ ...styles.textarea, ...(mistakesFocused ? styles.inputFocus : {}) }}
            value={mistakesLessons}
            onChange={(e) => setMistakesLessons(e.target.value)}
            placeholder="What would you do differently next time? Any pitfalls to avoid?"
            onFocus={() => setMistakesFocused(true)}
            onBlur={() => setMistakesFocused(false)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Overall Difficulty</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setOverallDifficulty(n)}
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: overallDifficulty >= n ? '#fde68a' : '#fff',
                  cursor: 'pointer'
                }}
                aria-label={`Set overall difficulty to ${n}`}
              >
                {overallDifficulty >= n ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Resources Used (links, one per line)</label>
          <textarea
            style={{ ...styles.textarea, ...(resourcesFocused ? styles.inputFocus : {}) }}
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            placeholder={"Paste links to LeetCode problems or YouTube playlists that helped you."}
            onFocus={() => setResourcesFocused(true)}
            onBlur={() => setResourcesFocused(false)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <input id="anon" type="checkbox" checked={postAnonymously} onChange={(e) => setPostAnonymously(e.target.checked)} />
          <label htmlFor="anon" style={{ ...styles.label, margin: 0 }}>Post Anonymously</label>
        </div>
        </>
        )}

        <div style={styles.navRow}>
          {step > 1 ? (
            <button type="button" style={styles.navBtn} onClick={() => setStep(step - 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Back</span>
            </button>
          ) : <span />}
          {step < 3 ? (
            <button type="button" style={{ ...styles.navBtn, background: '#4f46e5' }} onClick={() => setStep(step + 1)}>
              <span>Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ) : null}
        </div>

        {errorMsg && <div style={{ color: 'crimson', marginBottom: 10 }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'seagreen', marginBottom: 10 }}>{successMsg}</div>}
        {step === 3 && (
          <button type="submit" style={styles.button} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Experience'}</button>
        )}
      </form>
    </div>
  );
};

export default AddPost;
