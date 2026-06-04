import React, { useState } from 'react';
import { swapAPI } from '../../services/api';

export default function SwapRequestModal({ user, currentUser, onClose, onSent }) {
  const [senderSkill, setSenderSkill] = useState('');
  const [receiverSkill, setReceiverSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!senderSkill) { setError('Select a skill you can teach!'); return; }
    if (!receiverSkill) { setError('Select a skill you want to learn!'); return; }
    setLoading(true);
    try {
      await swapAPI.sendRequest(user._id, { senderSkill, receiverSkill, message });
      onSent && onSent();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, bottom:0,
      background:'rgba(0,0,0,0.5)', display:'flex',
      alignItems:'center', justifyContent:'center', zIndex:1000,
      padding:'1rem'
    }} onClick={onClose}>
      <div style={{
        background:'white', borderRadius:'20px', padding:'2rem',
        width:'100%', maxWidth:'480px',
        boxShadow:'0 25px 50px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h2 style={{ margin:0, fontSize:'1.3rem', fontWeight:'800', color:'#333' }}>
            🤝 Swap Skills with {user.name}
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#aaa' }}>✕</button>
        </div>

        {error && (
          <div style={{ background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:'10px', padding:'0.75rem 1rem', marginBottom:'1rem', color:'#e53935', fontSize:'0.9rem' }}>
            {error}
          </div>
        )}

        {/* I will teach */}
        <div style={{ marginBottom:'1.25rem' }}>
          <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:'700', color:'#555', fontSize:'0.9rem' }}>
            ⚡ I will teach ({currentUser.name})
          </label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.5rem' }}>
            {currentUser.skillsHave?.map(skill => (
              <button key={skill} type="button"
                onClick={() => setSenderSkill(skill)}
                style={{
                  padding:'0.4rem 0.9rem', borderRadius:'20px', border:'2px solid',
                  borderColor: senderSkill === skill ? '#667eea' : '#e8e8e8',
                  background: senderSkill === skill ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
                  color: senderSkill === skill ? 'white' : '#666',
                  cursor:'pointer', fontWeight:'600', fontSize:'0.85rem'
                }}>
                {skill}
              </button>
            ))}
          </div>
          {currentUser.skillsHave?.length === 0 && (
            <p style={{ color:'#aaa', fontSize:'0.85rem' }}>Add skills to your profile first!</p>
          )}
        </div>

        {/* I want to learn */}
        <div style={{ marginBottom:'1.25rem' }}>
          <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:'700', color:'#555', fontSize:'0.9rem' }}>
            🎯 I want to learn from {user.name}
          </label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.5rem' }}>
            {user.skillsHave?.map(skill => (
              <button key={skill} type="button"
                onClick={() => setReceiverSkill(skill)}
                style={{
                  padding:'0.4rem 0.9rem', borderRadius:'20px', border:'2px solid',
                  borderColor: receiverSkill === skill ? '#10b981' : '#e8e8e8',
                  background: receiverSkill === skill ? '#10b981' : 'white',
                  color: receiverSkill === skill ? 'white' : '#666',
                  cursor:'pointer', fontWeight:'600', fontSize:'0.85rem'
                }}>
                {skill}
              </button>
            ))}
          </div>
          {user.skillsHave?.length === 0 && (
            <p style={{ color:'#aaa', fontSize:'0.85rem' }}>This user has no skills listed yet.</p>
          )}
        </div>

        {/* Message */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:'700', color:'#555', fontSize:'0.9rem' }}>
            💬 Message (optional)
          </label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Hi! I'd love to swap skills with you..."
            rows={3}
            style={{ width:'100%', padding:'0.75rem 1rem', border:'2px solid #e8e8e8', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'inherit' }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e8e8e8'}
          />
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={onClose} style={{ flex:1, padding:'0.9rem', background:'#f0f0f0', color:'#666', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'600', cursor:'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex:2, padding:'0.9rem', background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'700', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Sending...' : '🤝 Send Swap Request'}
          </button>
        </div>
      </div>
    </div>
  );
}