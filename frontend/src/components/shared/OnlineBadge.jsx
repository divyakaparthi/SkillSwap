import React from 'react';

export default function OnlineBadge({ isOnline, size = 12 }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: isOnline ? '#10b981' : '#9ca3af',
      border: '2px solid white',
      flexShrink: 0,
      boxShadow: isOnline ? '0 0 6px rgba(16,185,129,0.5)' : 'none',
      transition: 'all 0.3s'
    }} title={isOnline ? 'Online' : 'Offline'} />
  );
}