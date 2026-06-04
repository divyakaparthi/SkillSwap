import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../../services/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await usersAPI.search(query);
        setResults(data.users);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const goToUser = (id) => {
    navigate(`/user/${id}`);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '0.85rem', top: '50%',
          transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none'
        }}>🔍</span>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder="Search users or skills..."
          style={{
            width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
            border: '2px solid #f0f0f0', borderRadius: '12px',
            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => { e.target.style.borderColor = '#667eea'; setShowResults(true); }}
          onBlur={e => e.target.style.borderColor = '#f0f0f0'}
        />
        {loading && (
          <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#aaa' }}>
            ⏳
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && query && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: 'white', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0',
          zIndex: 300
        }}>
          {results.length === 0 && !loading ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#aaa' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No users found for "{query}"</p>
            </div>
          ) : (
            results.map(user => (
              <div key={user._id} onClick={() => goToUser(user._id)}
                style={{
                  padding: '0.75rem 1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  borderBottom: '1px solid #f8f8f8'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f8ff'}
                onMouseOut={e => e.currentTarget.style.background = 'white'}
              >
                {/* Avatar */}
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '0.9rem'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {/* Info */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#333' }}>{user.name}</p>
                    {user.isOnline && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>{user.college} • {user.year}</p>
                  {user.skillsHave?.length > 0 && (
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#667eea' }}>
                      ⚡ {user.skillsHave.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>→</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}