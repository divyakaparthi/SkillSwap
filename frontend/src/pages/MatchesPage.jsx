import React, { useEffect, useState } from 'react';
import { matchesAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import MatchCard from '../components/matches/MatchCard';

export default function MatchesPage() {
  const { colors } = useTheme();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    matchesAPI.getMatches().then(({ data }) => {
      setMatches(data.matches);
      setLoading(false);
    });
  }, []);

  const filtered = matches.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.skillsHave?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      m.skillsWant?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'high') return matchesSearch && m.matchScore >= 50;
    if (filter === 'online') return matchesSearch && m.isOnline;
    return matchesSearch;
  });

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', flexDirection:'column', background:colors.bg }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔄</div>
      <p style={{ color:'#667eea', fontWeight:'600', fontSize:'1.1rem' }}>Finding your matches...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'2rem', fontWeight:'800', color:colors.text, margin:'0 0 0.5rem' }}>Find Matches 🎯</h1>
          <p style={{ color:colors.subtext, margin:0 }}>{matches.length} people found • Sorted by match score</p>
        </div>

        <div style={{ display:'flex', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or skill..."
            style={{ flex:1, minWidth:'200px', padding:'0.85rem 1rem', border:`2px solid ${colors.inputBorder}`, borderRadius:'12px', fontSize:'1rem', outline:'none', background:colors.input, color:colors.text }}
          />
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {[{key:'all',label:'All'},{key:'high',label:'🔥 High Match'},{key:'online',label:'🟢 Online'}].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ padding:'0.85rem 1.25rem', borderRadius:'12px', border:'2px solid', borderColor: filter === f.key ? '#667eea' : colors.inputBorder, background: filter === f.key ? 'linear-gradient(135deg, #667eea, #764ba2)' : colors.card, color: filter === f.key ? 'white' : colors.subtext, cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:colors.subtext }}>
            <p style={{ fontSize:'3rem' }}>🔍</p>
            <p style={{ fontSize:'1.1rem', fontWeight:'600' }}>No matches found</p>
            <p style={{ fontSize:'0.9rem' }}>Try a different search or update your skills!</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.5rem' }}>
            {filtered.map(m => <MatchCard key={m._id} match={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}