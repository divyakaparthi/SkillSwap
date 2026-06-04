import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usersAPI } from '../services/api';
import { Link } from 'react-router-dom';
import SkillTag from '../components/profile/SkillTag';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('swaps');

  useEffect(() => {
    usersAPI.leaderboard().then(({ data }) => {
      setUsers(data.users);
      setLoading(false);
    });
  }, []);

  const sorted = [...users].sort((a, b) => {
    if (filter === 'swaps') return b.swapsCount - a.swapsCount;
    if (filter === 'rating') return b.rating - a.rating;
    if (filter === 'skills') return b.skillsHave.length - a.skillsHave.length;
    return 0;
  });

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', background:colors.bg, flexDirection:'column' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏆</div>
      <p style={{ color:'#667eea', fontWeight:'600' }}>Loading leaderboard...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'800px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'2.5rem', fontWeight:'800', color:colors.text, margin:'0 0 0.5rem' }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color:colors.subtext, margin:0 }}>Top skill swappers in the community!</p>
        </div>

        {/* Top 3 Podium */}
        {sorted.length >= 3 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:'1rem', marginBottom:'2rem' }}>
            {/* 2nd Place */}
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ background:'linear-gradient(135deg, #c0c0c0, #a0a0a0)', borderRadius:'16px 16px 0 0', padding:'1.5rem 1rem', color:'white' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🥈</div>
                <div style={{ width:'50px', height:'50px', borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', fontWeight:'800', margin:'0 auto 0.5rem' }}>
                  {sorted[1]?.name?.charAt(0).toUpperCase()}
                </div>
                <p style={{ margin:0, fontWeight:'700', fontSize:'0.9rem' }}>{sorted[1]?.name}</p>
                <p style={{ margin:'0.25rem 0 0', opacity:0.85, fontSize:'0.8rem' }}>{sorted[1]?.swapsCount} swaps</p>
              </div>
              <div style={{ background:'#c0c0c0', height:'60px', borderRadius:'0 0 8px 8px' }} />
            </div>

            {/* 1st Place */}
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ background:'linear-gradient(135deg, #ffd700, #ffb300)', borderRadius:'16px 16px 0 0', padding:'2rem 1rem', color:'white' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🥇</div>
                <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:'800', margin:'0 auto 0.5rem' }}>
                  {sorted[0]?.name?.charAt(0).toUpperCase()}
                </div>
                <p style={{ margin:0, fontWeight:'700' }}>{sorted[0]?.name}</p>
                <p style={{ margin:'0.25rem 0 0', opacity:0.85, fontSize:'0.85rem' }}>{sorted[0]?.swapsCount} swaps</p>
              </div>
              <div style={{ background:'#ffd700', height:'80px', borderRadius:'0 0 8px 8px' }} />
            </div>

            {/* 3rd Place */}
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ background:'linear-gradient(135deg, #cd7f32, #a0522d)', borderRadius:'16px 16px 0 0', padding:'1.25rem 1rem', color:'white' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'0.5rem' }}>🥉</div>
                <div style={{ width:'45px', height:'45px', borderRadius:'50%', background:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:'800', margin:'0 auto 0.5rem' }}>
                  {sorted[2]?.name?.charAt(0).toUpperCase()}
                </div>
                <p style={{ margin:0, fontWeight:'700', fontSize:'0.9rem' }}>{sorted[2]?.name}</p>
                <p style={{ margin:'0.25rem 0 0', opacity:0.85, fontSize:'0.8rem' }}>{sorted[2]?.swapsCount} swaps</p>
              </div>
              <div style={{ background:'#cd7f32', height:'40px', borderRadius:'0 0 8px 8px' }} />
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', background:colors.card, padding:'0.5rem', borderRadius:'12px', border:`1px solid ${colors.border}` }}>
          {[
            { key:'swaps', label:'🔄 Most Swaps' },
            { key:'rating', label:'⭐ Top Rated' },
            { key:'skills', label:'⚡ Most Skills' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ flex:1, padding:'0.65rem', borderRadius:'8px', border:'none',
                background: filter === f.key ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: filter === f.key ? 'white' : colors.subtext,
                cursor:'pointer', fontWeight:'600', fontSize:'0.9rem'
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Full List */}
        <div style={{ background:colors.card, borderRadius:'16px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
          {sorted.map((user, index) => (
            <Link key={user._id} to={`/user/${user._id}`} style={{ textDecoration:'none' }}>
              <div style={{
                display:'flex', alignItems:'center', gap:'1rem',
                padding:'1rem 1.5rem', borderBottom:`1px solid ${colors.border}`,
                transition:'background 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.background = colors.hover}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Rank */}
                <div style={{ width:'36px', textAlign:'center', fontSize: index < 3 ? '1.5rem' : '1rem', fontWeight:'800', color: index < 3 ? ['#ffd700','#c0c0c0','#cd7f32'][index] : colors.subtext, flexShrink:0 }}>
                  {index < 3 ? medals[index] : `#${index + 1}`}
                </div>

                {/* Avatar */}
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'1.1rem' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div style={{ position:'absolute', bottom:0, right:0, width:'12px', height:'12px', borderRadius:'50%', background:'#10b981', border:'2px solid white' }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <p style={{ margin:0, fontWeight:'700', color:colors.text }}>{user.name}</p>
                    {user.badges?.length > 0 && (
                      <span style={{ fontSize:'0.75rem', background:'#f0f0ff', color:'#667eea', padding:'0.15rem 0.5rem', borderRadius:'10px', fontWeight:'600' }}>
                        {user.badges[user.badges.length - 1]}
                      </span>
                    )}
                  </div>
                  <p style={{ margin:'0.15rem 0 0', color:colors.subtext, fontSize:'0.82rem' }}>{user.college} • {user.year}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem', marginTop:'0.35rem' }}>
                    {user.skillsHave?.slice(0, 3).map(s => <SkillTag key={s} skill={s} color="green" />)}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ margin:0, fontWeight:'800', color:'#667eea', fontSize:'1.1rem' }}>
                    {filter === 'swaps' ? user.swapsCount : filter === 'rating' ? (user.rating || 0) : user.skillsHave?.length || 0}
                  </p>
                  <p style={{ margin:0, color:colors.subtext, fontSize:'0.75rem' }}>
                    {filter === 'swaps' ? 'swaps' : filter === 'rating' ? '⭐ rating' : 'skills'}
                  </p>
                  {user.rating > 0 && filter !== 'rating' && (
                    <p style={{ margin:'0.15rem 0 0', color:'#fbbf24', fontSize:'0.8rem', fontWeight:'600' }}>⭐ {user.rating}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}