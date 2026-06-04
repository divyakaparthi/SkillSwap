import React from 'react';

const badgeConfig = {
  'First Swap':      { emoji: '🥇', color: '#ffd700', bg: '#fffde7', desc: 'Completed first skill swap!' },
  'Active Learner':  { emoji: '📚', color: '#42a5f5', bg: '#e3f2fd', desc: 'Completed 5 skill swaps!' },
  'Skill Champion':  { emoji: '🏆', color: '#ab47bc', bg: '#f3e5f5', desc: 'Completed 10 skill swaps!' },
  'Top Mentor':      { emoji: '⭐', color: '#ef5350', bg: '#ffebee', desc: 'Rated 4.5+ with 3+ reviews!' },
};

export default function BadgeCard({ badge, earned = true }) {
  const config = badgeConfig[badge] || { emoji: '🎖️', color: '#666', bg: '#f5f5f5', desc: badge };

  return (
    <div style={{
      background: earned ? config.bg : '#f5f5f5',
      border: `2px solid ${earned ? config.color : '#e0e0e0'}`,
      borderRadius: '16px', padding: '1rem',
      textAlign: 'center', opacity: earned ? 1 : 0.5,
      transition: 'transform 0.2s',
      position: 'relative'
    }}
      onMouseOver={e => earned && (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {!earned && (
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          fontSize: '0.7rem', background: '#e0e0e0',
          padding: '0.15rem 0.4rem', borderRadius: '10px', color: '#888'
        }}>Locked 🔒</div>
      )}
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{config.emoji}</div>
      <p style={{ margin: '0 0 0.25rem', fontWeight: '700', fontSize: '0.9rem', color: earned ? config.color : '#aaa' }}>
        {badge}
      </p>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{config.desc}</p>
    </div>
  );
}