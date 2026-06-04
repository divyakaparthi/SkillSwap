import React from 'react';

const colors = {
  green:  { bg: '#e8f5e9', text: '#2e7d32' },
  purple: { bg: '#f3e5f5', text: '#7b1fa2' },
  blue:   { bg: '#e3f2fd', text: '#1565c0' },
};

export default function SkillTag({ skill, color = 'blue' }) {
  const { bg, text } = colors[color] || colors.blue;
  return (
    <span style={{
      background: bg, color: text, padding: '0.25rem 0.75rem',
      borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'
    }}>
      {skill}
    </span>
  );
}