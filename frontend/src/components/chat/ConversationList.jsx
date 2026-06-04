import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConversationList({ conversations, currentUserId }) {
  const navigate = useNavigate();

  if (conversations.length === 0) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>
      <p style={{ fontSize: '2rem' }}>💬</p>
      <p>No conversations yet.</p>
      <p style={{ fontSize: '0.85rem' }}>Go to Matches to start chatting!</p>
    </div>
  );

  return (
    <div>
      {conversations.map(conv => {
        const msg = conv.lastMsg;
        const otherId = msg?.sender === currentUserId ? msg?.receiver : msg?.sender;
        return (
          <div key={conv._id} onClick={() => navigate(`/chat/${otherId}`)}
            style={{
              padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f8f8ff'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <div style={{
              width: '45px', height: '45px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700'
            }}>💬</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>Conversation</p>
              <p style={{ margin: 0, color: '#888', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {msg?.text || 'No messages yet'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}