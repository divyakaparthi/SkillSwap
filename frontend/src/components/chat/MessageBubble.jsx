import React from 'react';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div style={{
      display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '0.75rem'
    }}>
      {!isOwn && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '700', fontSize: '0.85rem',
          marginRight: '0.5rem', flexShrink: 0
        }}>
          {message.sender?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <div style={{
          background: isOwn ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
          color: isOwn ? 'white' : '#333',
          padding: '0.75rem 1rem', borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          maxWidth: '300px', fontSize: '0.95rem', lineHeight: '1.4',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {message.text}
        </div>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#aaa',
          textAlign: isOwn ? 'right' : 'left' }}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
        </p>
      </div>
    </div>
  );
}