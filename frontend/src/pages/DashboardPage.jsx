import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { matchesAPI, chatAPI, usersAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [stats, setStats] = useState({ matches: 0, conversations: 0, connections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      matchesAPI.getMatches(),
      chatAPI.getConversations(),
      usersAPI.getConnections(),
    ]).then(([matchRes, chatRes, connRes]) => {
      setStats({
        matches: matchRes.data.total || 0,
        conversations: chatRes.data.conversations?.length || 0,
        connections: connRes.data.connections?.length || 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { title:'Find Matches', desc:'Discover people with skills you want', link:'/matches', emoji:'🎯', color:'linear-gradient(135deg, #667eea, #764ba2)' },
    { title:'Messages', desc:'Chat with your skill partners', link:'/chat', emoji:'💬', color:'linear-gradient(135deg, #11998e, #38ef7d)' },
    { title:'My Profile', desc:'Update your skills and bio', link:'/profile', emoji:'👤', color:'linear-gradient(135deg, #f093fb, #f5576c)' },
  ];

  const statCards = [
    { label:'Potential Matches', value: loading ? '...' : stats.matches, emoji:'🤝', color:'#667eea' },
    { label:'Conversations', value: loading ? '...' : stats.conversations, emoji:'💬', color:'#11998e' },
    { label:'Connections', value: loading ? '...' : stats.connections, emoji:'🔗', color:'#f5576c' },
    { label:'Skills Listed', value: user?.skillsHave?.length || 0, emoji:'⚡', color:'#f59e0b' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'1000px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius:'20px', padding:'2rem', marginBottom:'2rem',
          color:'white', position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', top:'-20px', right:'-20px', fontSize:'8rem', opacity:'0.1' }}>🔄</div>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{
              width:'60px', height:'60px', borderRadius:'50%',
              background:'rgba(255,255,255,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.5rem', fontWeight:'800', flexShrink:0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:'1.6rem', fontWeight:'800' }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ margin:'0.25rem 0 0', opacity:0.85, fontSize:'0.95rem' }}>
                {user?.college} • {user?.year} • {user?.bio || 'Ready to swap skills!'}
              </p>
            </div>
          </div>
          {user?.skillsHave?.length > 0 && (
            <div style={{ marginTop:'1.25rem', display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {user.skillsHave.slice(0, 4).map(s => (
                <span key={s} style={{ background:'rgba(255,255,255,0.2)', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.82rem', fontWeight:'600' }}>⚡ {s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
          {statCards.map(stat => (
            <div key={stat.label} style={{ background:colors.card, borderRadius:'16px', padding:'1.25rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', textAlign:'center', border:`1px solid ${colors.border}` }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'0.25rem' }}>{stat.emoji}</div>
              <div style={{ fontSize:'1.8rem', fontWeight:'800', color:stat.color }}>{stat.value}</div>
              <div style={{ fontSize:'0.8rem', color:colors.subtext, marginTop:'0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <h2 style={{ fontSize:'1.2rem', fontWeight:'700', color:colors.text, marginBottom:'1rem' }}>Quick Actions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
          {cards.map(card => (
            <Link key={card.title} to={card.link} style={{ textDecoration:'none' }}>
              <div style={{ background:card.color, borderRadius:'16px', padding:'1.75rem', color:'white', cursor:'pointer', transition:'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{card.emoji}</div>
                <h3 style={{ margin:'0 0 0.5rem', fontSize:'1.1rem', fontWeight:'700' }}>{card.title}</h3>
                <p style={{ margin:0, opacity:0.85, fontSize:'0.88rem' }}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {(!user?.skillsHave?.length || !user?.skillsWant?.length) && (
          <div style={{ marginTop:'1.5rem', background: colors.isDark ? '#2a1f00' : '#fffbeb', border:'1px solid #fcd34d', borderRadius:'16px', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
            <span style={{ fontSize:'1.5rem' }}>⚠️</span>
            <div>
              <p style={{ margin:0, fontWeight:'700', color:'#92400e' }}>Complete your profile!</p>
              <p style={{ margin:'0.25rem 0 0', color:'#b45309', fontSize:'0.9rem' }}>
                Add your skills to get better matches.{' '}
                <Link to="/profile" style={{ color:'#d97706', fontWeight:'700' }}>Update now →</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}