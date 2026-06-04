import React from 'react';
import { Link } from 'react-router-dom';
import { matchesAPI } from '../../services/api';
import SkillTag from '../profile/SkillTag';
import OnlineBadge from '../shared/OnlineBadge';
import useOnlineUsers from '../../hooks/useOnlineUsers';

export default function MatchCard({ match, onConnect }) {
  const { isOnline } = useOnlineUsers();
  const online = isOnline(match._id) || match.isOnline;

  const handleConnect = async () => {
    try {
      await matchesAPI.connect(match._id);
      onConnect && onConnect(match._id);
      alert('Connected successfully!');
    } catch (err) {
      alert('Already connected!');
    }
  };

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
      transition: 'transform 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:'1rem', gap:'1rem' }}>
        <div style={{ position:'relative' }}>
          <div style={{
            width:'50px', height:'50px', borderRadius:'50%',
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontWeight:'700', fontSize:'1.2rem'
          }}>
            {match.name?.charAt(0).toUpperCase()}
          </div>
          {/* Online badge on avatar */}
          <div style={{ position:'absolute', bottom:0, right:0 }}>
            <OnlineBadge isOnline={online} size={14} />
          </div>
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:'700', color:'#333' }}>{match.name}</h3>
            <span style={{ fontSize:'0.78rem', color: online ? '#10b981' : '#9ca3af', fontWeight:'600' }}>
              {online ? '● Online' : '○ Offline'}
            </span>
          </div>
          <p style={{ margin:0, color:'#888', fontSize:'0.85rem' }}>{match.college} • {match.year}</p>
        </div>
        <div style={{
          marginLeft:'auto', background:'linear-gradient(135deg, #667eea, #764ba2)',
          color:'white', padding:'0.3rem 0.7rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700'
        }}>
          {match.matchScore}% match
        </div>
      </div>

      {match.bio && <p style={{ color:'#666', fontSize:'0.9rem', marginBottom:'1rem' }}>{match.bio}</p>}

      <div style={{ marginBottom:'0.75rem' }}>
        <p style={{ margin:'0 0 0.4rem', fontSize:'0.8rem', fontWeight:'700', color:'#555' }}>HAS SKILLS</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
          {match.skillsHave?.length > 0
            ? match.skillsHave.map(s => <SkillTag key={s} skill={s} color="green" />)
            : <span style={{ color:'#aaa', fontSize:'0.85rem' }}>None listed</span>}
        </div>
      </div>

      <div style={{ marginBottom:'1.25rem' }}>
        <p style={{ margin:'0 0 0.4rem', fontSize:'0.8rem', fontWeight:'700', color:'#555' }}>WANTS TO LEARN</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
          {match.skillsWant?.length > 0
            ? match.skillsWant.map(s => <SkillTag key={s} skill={s} color="purple" />)
            : <span style={{ color:'#aaa', fontSize:'0.85rem' }}>None listed</span>}
        </div>
      </div>

      <div style={{ display:'flex', gap:'0.75rem' }}>
        <Link to={`/chat/${match._id}`} style={{
          flex:1, background:'#f0f0ff', color:'#667eea', padding:'0.65rem',
          borderRadius:'10px', textDecoration:'none', textAlign:'center',
          fontWeight:'600', fontSize:'0.9rem'
        }}>💬 Chat</Link>
        <button onClick={handleConnect} style={{
          flex:1, background:'linear-gradient(135deg, #667eea, #764ba2)',
          color:'white', padding:'0.65rem', borderRadius:'10px',
          border:'none', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem'
        }}>🤝 Connect</button>
      </div>
    </div>
  );
}