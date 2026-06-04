import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usersAPI } from '../services/api';
import SkillTag from '../components/profile/SkillTag';
import BadgeCard from '../components/profile/BadgeCard';
import ProfilePDF from '../components/profile/ProfilePDF';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', college: user?.college || '',
    year: user?.year || '', bio: user?.bio || '',
    skillsHave: user?.skillsHave?.join(', ') || '',
    skillsWant: user?.skillsWant?.join(', ') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await usersAPI.updateProfile({
      ...form,
      skillsHave: form.skillsHave.split(',').map(s => s.trim()).filter(Boolean),
      skillsWant: form.skillsWant.split(',').map(s => s.trim()).filter(Boolean),
    });
    updateUser(data.user);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    width:'100%', padding:'0.85rem 1rem',
    border:`2px solid ${colors.inputBorder}`,
    borderRadius:'12px', fontSize:'1rem', outline:'none',
    boxSizing:'border-box', background:colors.input, color:colors.text
  };

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>

        {/* Profile Header */}
        <div style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', borderRadius:'20px', padding:'2rem', marginBottom:'1.5rem', color:'white', textAlign:'center' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'3px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:'800', margin:'0 auto 1rem' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ margin:'0 0 0.25rem', fontSize:'1.6rem', fontWeight:'800' }}>{user?.name}</h1>
          <p style={{ margin:'0 0 0.5rem', opacity:0.85 }}>{user?.email}</p>
          <p style={{ margin:'0 0 1rem', opacity:0.75, fontSize:'0.9rem' }}>{user?.college} • {user?.year}</p>
          {user?.bio && <p style={{ margin:'0 0 1rem', opacity:0.9, fontSize:'0.95rem', fontStyle:'italic' }}>"{user?.bio}"</p>}
          <div style={{ display:'flex', justifyContent:'center', gap:'2rem' }}>
            {[{label:'Rating',value:user?.rating||'0'},{label:'Reviews',value:user?.reviewCount||'0'},{label:'Swaps',value:user?.swapsCount||'0'}].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize:'1.4rem', fontWeight:'800' }}>{stat.value}</div>
                <div style={{ fontSize:'0.8rem', opacity:0.75 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {!editing && (
          <div style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
            <h3 style={{ margin:'0 0 1rem', fontWeight:'700', color:colors.text }}>⚡ My Skills</h3>
            <div style={{ marginBottom:'1rem' }}>
              <p style={{ margin:'0 0 0.5rem', fontSize:'0.85rem', fontWeight:'700', color:colors.subtext }}>I CAN TEACH</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {user?.skillsHave?.length > 0 ? user.skillsHave.map(s => <SkillTag key={s} skill={s} color="green" />) : <span style={{ color:'#aaa' }}>No skills added yet</span>}
              </div>
            </div>
            <div>
              <p style={{ margin:'0 0 0.5rem', fontSize:'0.85rem', fontWeight:'700', color:colors.subtext }}>I WANT TO LEARN</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {user?.skillsWant?.length > 0 ? user.skillsWant.map(s => <SkillTag key={s} skill={s} color="purple" />) : <span style={{ color:'#aaa' }}>No skills added yet</span>}
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {!editing && (
          <div style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
            <h3 style={{ margin:'0 0 1rem', fontWeight:'700', color:colors.text }}>🏆 Badges & Achievements</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'1rem' }}>
              {['First Swap','Active Learner','Skill Champion','Top Mentor'].map(badge => (
                <BadgeCard key={badge} badge={badge} earned={user?.badges?.includes(badge)} />
              ))}
            </div>
            {user?.badges?.length > 0 && (
              <p style={{ margin:'1rem 0 0', textAlign:'center', color:'#667eea', fontWeight:'600', fontSize:'0.9rem' }}>
                🎉 You have earned {user.badges.length} badge{user.badges.length > 1 ? 's' : ''}!
              </p>
            )}
          </div>
        )}
{/* Download PDF */}
{!editing && <ProfilePDF user={user} />}

        {/* Edit Button */}
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ width:'100%', padding:'1rem', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'700', cursor:'pointer', marginBottom:'1rem' }}>
            ✏️ Edit Profile
          </button>
        )}

        {saved && (
          <div style={{ background:'#e8f5e9', border:'1px solid #a5d6a7', borderRadius:'12px', padding:'1rem', marginBottom:'1rem', textAlign:'center', color:'#2e7d32', fontWeight:'600' }}>
            ✅ Profile saved successfully!
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <div style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
            <h3 style={{ margin:'0 0 1.5rem', fontWeight:'700', color:colors.text }}>✏️ Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              {[{key:'name',label:'Full Name'},{key:'college',label:'College'},{key:'year',label:'Year'},{key:'bio',label:'Bio'}].map(({ key, label }) => (
                <div key={key} style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', marginBottom:'0.4rem', fontWeight:'600', color:colors.subtext, fontSize:'0.9rem' }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', marginBottom:'0.4rem', fontWeight:'600', color:colors.subtext, fontSize:'0.9rem' }}>⚡ Skills I Can Teach</label>
                <input value={form.skillsHave} onChange={e => setForm({...form,skillsHave:e.target.value})} placeholder="HTML, CSS, JavaScript" style={inputStyle} />
              </div>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', marginBottom:'0.4rem', fontWeight:'600', color:colors.subtext, fontSize:'0.9rem' }}>🎯 Skills I Want to Learn</label>
                <input value={form.skillsWant} onChange={e => setForm({...form,skillsWant:e.target.value})} placeholder="React, Node.js, Python" style={inputStyle} />
              </div>
              <div style={{ display:'flex', gap:'1rem' }}>
                <button type="button" onClick={() => setEditing(false)} style={{ flex:1, padding:'1rem', background:colors.hover, color:colors.subtext, border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'600', cursor:'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex:2, padding:'1rem', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'700', cursor:'pointer' }}>Save Profile →</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}