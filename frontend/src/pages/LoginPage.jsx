import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: '24px',
        padding: '3rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', marginBottom: '1rem'
          }}>🔄</div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SkillSwap
          </h1>
          <p style={{ color: '#888', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
            Swap skills, grow together
          </p>
        </div>

        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.3rem', fontWeight: '700', color: '#333' }}>
          Welcome back! 👋
        </h2>

        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: '12px',
            padding: '0.75rem 1rem', marginBottom: '1rem', color: '#e53935', fontSize: '0.9rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>
              Email
            </label>
            <input type="email" placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{
                width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8',
                borderRadius: '12px', fontSize: '1rem', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>
              Password
            </label>
            <input type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{
                width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8',
                borderRadius: '12px', fontSize: '1rem', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '0.95rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#888', fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', fontWeight: '700', textDecoration: 'none' }}>
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
}