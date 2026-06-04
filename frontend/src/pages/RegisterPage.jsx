import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { title: 'Basic Info', desc: 'Tell us who you are', emoji: '👤' },
  { title: 'Education', desc: 'Where do you study?', emoji: '🎓' },
  { title: 'Skills', desc: 'What can you teach & learn?', emoji: '⚡' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    college: '', year: '',
    skillsHave: '', skillsWant: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name) return 'Please enter your name';
      if (!form.email) return 'Please enter your email';
      if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters';
    }
    if (step === 1) {
      if (!form.college) return 'Please enter your college';
      if (!form.year) return 'Please enter your year';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register({
        ...form,
        skillsHave: form.skillsHave.split(',').map(s => s.trim()).filter(Boolean),
        skillsWant: form.skillsWant.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: '24px',
        padding: '2.5rem', width: '100%', maxWidth: '460px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', marginBottom: '0.75rem'
          }}>🔄</div>
          <h1 style={{
            margin: 0, fontSize: '1.6rem', fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>SkillSwap</h1>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: i <= step ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: i < step ? '1rem' : '0.9rem',
                  color: i <= step ? 'white' : '#aaa',
                  fontWeight: '700', transition: 'all 0.3s',
                  boxShadow: i === step ? '0 4px 12px rgba(102,126,234,0.4)' : 'none'
                }}>
                  {i < step ? '✓' : s.emoji}
                </div>
                <p style={{
                  margin: '0.4rem 0 0', fontSize: '0.75rem', fontWeight: '600',
                  color: i === step ? '#667eea' : i < step ? '#764ba2' : '#aaa'
                }}>{s.title}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', margin: '0 0.25rem',
                  background: i < step ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0',
                  transition: 'background 0.3s', marginBottom: '1.2rem'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', fontWeight: '700', color: '#333' }}>
            {STEPS[step].emoji} {STEPS[step].title}
          </h2>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>{STEPS[step].desc}</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: '10px',
            padding: '0.75rem 1rem', marginBottom: '1rem', color: '#e53935', fontSize: '0.9rem'
          }}>{error}</div>
        )}

        {/* Step 1 — Basic Info */}
        {step === 0 && (
          <div>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Divyasree Kaparthi' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Education */}
        {step === 1 && (
          <div>
            {[
              { key: 'college', label: 'College Name', type: 'text', placeholder: 'JNTU Anantapur' },
              { key: 'year', label: 'Current Year', type: 'text', placeholder: '2nd Year' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                />
              </div>
            ))}

            {/* Year Quick Select */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#888' }}>Quick select:</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                  <button key={y} type="button" onClick={() => update('year', y)}
                    style={{
                      padding: '0.4rem 0.9rem', borderRadius: '20px', border: '2px solid',
                      borderColor: form.year === y ? '#667eea' : '#e8e8e8',
                      background: form.year === y ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
                      color: form.year === y ? 'white' : '#666',
                      cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                    }}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Skills */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>
                ⚡ Skills I Can Teach
                <span style={{ color: '#aaa', fontWeight: '400' }}> (comma separated)</span>
              </label>
              <input placeholder="e.g. HTML, CSS, JavaScript, Python"
                value={form.skillsHave}
                onChange={e => update('skillsHave', e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
              {/* Popular skills */}
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Java', 'C++'].map(s => (
                  <button key={s} type="button"
                    onClick={() => update('skillsHave', form.skillsHave ? `${form.skillsHave}, ${s}` : s)}
                    style={{
                      padding: '0.25rem 0.65rem', borderRadius: '20px',
                      border: '1px solid #e8e8e8', background: '#f8f8ff',
                      color: '#667eea', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                    }}>+ {s}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>
                🎯 Skills I Want to Learn
                <span style={{ color: '#aaa', fontWeight: '400' }}> (comma separated)</span>
              </label>
              <input placeholder="e.g. React, Node.js, Machine Learning"
                value={form.skillsWant}
                onChange={e => update('skillsWant', e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: '12px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['React', 'Node.js', 'Python', 'ML', 'Django', 'Flutter', 'DSA'].map(s => (
                  <button key={s} type="button"
                    onClick={() => update('skillsWant', form.skillsWant ? `${form.skillsWant}, ${s}` : s)}
                    style={{
                      padding: '0.25rem 0.65rem', borderRadius: '20px',
                      border: '1px solid #e8e8e8', background: '#fdf4ff',
                      color: '#764ba2', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                    }}>+ {s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {step > 0 && (
            <button type="button" onClick={() => { setStep(prev => prev - 1); setError(''); }}
              style={{
                flex: 1, padding: '0.95rem', background: '#f0f0f0',
                color: '#666', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
              }}>← Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={nextStep}
              style={{
                flex: 2, padding: '0.95rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
              }}>Next →</button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{
                flex: 2, padding: '0.95rem',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
              }}>
              {loading ? 'Creating account...' : '🎉 Create Account'}
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}