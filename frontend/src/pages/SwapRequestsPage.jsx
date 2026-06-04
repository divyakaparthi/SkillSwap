import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { swapAPI } from '../services/api';

export default function SwapRequestsPage() {
  const { colors } = useTheme();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState('received');
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    Promise.all([swapAPI.getReceived(), swapAPI.getSent()])
      .then(([recRes, sentRes]) => {
        setReceived(recRes.data.requests);
        setSent(sentRes.data.requests);
        setLoading(false);
      });
  };

  useEffect(() => { loadRequests(); }, []);

  const handleAccept = async (id) => {
    await swapAPI.acceptRequest(id);
    loadRequests();
    alert('🎉 Request accepted! You are now connected!');
  };

  const handleDecline = async (id) => {
    await swapAPI.declineRequest(id);
    loadRequests();
  };

  const statusColor = { pending:'#f59e0b', accepted:'#10b981', declined:'#ef4444' };
  const statusEmoji = { pending:'⏳', accepted:'✅', declined:'❌' };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', background:colors.bg }}>
      <p style={{ color:'#667eea', fontWeight:'600' }}>Loading requests...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'2rem', fontWeight:'800', color:colors.text, margin:'0 0 0.5rem' }}>
            🤝 Swap Requests
          </h1>
          <p style={{ color:colors.subtext, margin:0 }}>Manage your skill swap requests</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', background:colors.card, padding:'0.5rem', borderRadius:'12px', border:`1px solid ${colors.border}` }}>
          {[
            { key:'received', label:`📥 Received (${received.length})` },
            { key:'sent', label:`📤 Sent (${sent.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex:1, padding:'0.65rem', borderRadius:'8px', border:'none',
                background: tab === t.key ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: tab === t.key ? 'white' : colors.subtext,
                cursor:'pointer', fontWeight:'600', fontSize:'0.95rem'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Received Requests */}
        {tab === 'received' && (
          <div>
            {received.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:colors.subtext }}>
                <p style={{ fontSize:'3rem' }}>📥</p>
                <p style={{ fontWeight:'600' }}>No pending requests</p>
                <p style={{ fontSize:'0.9rem' }}>When someone sends you a swap request it will appear here!</p>
              </div>
            ) : (
              received.map(req => (
                <div key={req._id} style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', marginBottom:'1rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
                  {/* Sender Info */}
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                    <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'1.2rem', flexShrink:0 }}>
                      {req.sender?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin:0, fontWeight:'700', color:colors.text, fontSize:'1rem' }}>{req.sender?.name}</p>
                      <p style={{ margin:0, color:colors.subtext, fontSize:'0.85rem' }}>{req.sender?.college}</p>
                    </div>
                    <div style={{ marginLeft:'auto', background:'#fff8e1', color:'#f59e0b', padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700' }}>
                      ⏳ Pending
                    </div>
                  </div>

                  {/* Swap Details */}
                  <div style={{ background:colors.bg, borderRadius:'12px', padding:'1rem', marginBottom:'1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ margin:'0 0 0.25rem', fontSize:'0.75rem', color:colors.subtext, fontWeight:'700' }}>THEY OFFER</p>
                        <span style={{ background:'#e8f5e9', color:'#2e7d32', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'700' }}>
                          ⚡ {req.senderSkill}
                        </span>
                      </div>
                      <div style={{ fontSize:'1.5rem', color:colors.subtext }}>⇄</div>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ margin:'0 0 0.25rem', fontSize:'0.75rem', color:colors.subtext, fontWeight:'700' }}>THEY WANT</p>
                        <span style={{ background:'#f3e5f5', color:'#7b1fa2', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'700' }}>
                          🎯 {req.receiverSkill}
                        </span>
                      </div>
                    </div>
                    {req.message && (
                      <p style={{ margin:'0.75rem 0 0', color:colors.subtext, fontSize:'0.9rem', fontStyle:'italic' }}>
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display:'flex', gap:'0.75rem' }}>
                    <button onClick={() => handleDecline(req._id)}
                      style={{ flex:1, padding:'0.75rem', background:'#fff0f0', color:'#e53935', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'700', fontSize:'0.9rem' }}>
                      ❌ Decline
                    </button>
                    <button onClick={() => handleAccept(req._id)}
                      style={{ flex:2, padding:'0.75rem', background:'linear-gradient(135deg, #10b981, #059669)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'700', fontSize:'0.9rem' }}>
                      ✅ Accept Swap!
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sent Requests */}
        {tab === 'sent' && (
          <div>
            {sent.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:colors.subtext }}>
                <p style={{ fontSize:'3rem' }}>📤</p>
                <p style={{ fontWeight:'600' }}>No sent requests</p>
                <p style={{ fontSize:'0.9rem' }}>Go to Matches and send a swap request!</p>
              </div>
            ) : (
              sent.map(req => (
                <div key={req._id} style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', marginBottom:'1rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                    <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'1.2rem', flexShrink:0 }}>
                      {req.receiver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin:0, fontWeight:'700', color:colors.text }}>{req.receiver?.name}</p>
                      <p style={{ margin:0, color:colors.subtext, fontSize:'0.85rem' }}>{req.receiver?.college}</p>
                    </div>
                    <div style={{ marginLeft:'auto', background: req.status === 'accepted' ? '#e8f5e9' : req.status === 'declined' ? '#fff0f0' : '#fff8e1', color: statusColor[req.status], padding:'0.3rem 0.75rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700' }}>
                      {statusEmoji[req.status]} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </div>
                  </div>

                  <div style={{ background:colors.bg, borderRadius:'12px', padding:'1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ margin:'0 0 0.25rem', fontSize:'0.75rem', color:colors.subtext, fontWeight:'700' }}>YOU OFFER</p>
                        <span style={{ background:'#e8f5e9', color:'#2e7d32', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'700' }}>
                          ⚡ {req.senderSkill}
                        </span>
                      </div>
                      <div style={{ fontSize:'1.5rem', color:colors.subtext }}>⇄</div>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ margin:'0 0 0.25rem', fontSize:'0.75rem', color:colors.subtext, fontWeight:'700' }}>YOU WANT</p>
                        <span style={{ background:'#f3e5f5', color:'#7b1fa2', padding:'0.3rem 0.8rem', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'700' }}>
                          🎯 {req.receiverSkill}
                        </span>
                      </div>
                    </div>
                    {req.message && (
                      <p style={{ margin:'0.75rem 0 0', color:colors.subtext, fontSize:'0.9rem', fontStyle:'italic' }}>
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}