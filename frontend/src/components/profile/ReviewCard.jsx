import React from 'react';

export default function ReviewCard({ review }) {
  const stars = Array(5).fill(0);

  return (
    <div style={{ background:'white', borderRadius:'12px', padding:'1.25rem', marginBottom:'0.75rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', border:'1px solid #f0f0f0' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
        {/* Avatar */}
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', flexShrink:0 }}>
          {review.reviewer?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex:1 }}>
          <p style={{ margin:0, fontWeight:'700', color:'#333', fontSize:'0.95rem' }}>{review.reviewer?.name}</p>
          <p style={{ margin:0, color:'#aaa', fontSize:'0.8rem' }}>
            {new Date(review.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
          </p>
        </div>
        {/* Stars */}
        <div style={{ display:'flex', gap:'2px' }}>
          {stars.map((_, i) => (
            <span key={i} style={{ color: i < review.rating ? '#fbbf24' : '#e0e0e0', fontSize:'1.1rem' }}>★</span>
          ))}
        </div>
      </div>

      {review.skillTag && (
        <span style={{ background:'#f0f0ff', color:'#667eea', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'600', marginBottom:'0.5rem', display:'inline-block' }}>
          ⚡ {review.skillTag}
        </span>
      )}

      <p style={{ margin:'0.5rem 0 0', color:'#555', fontSize:'0.9rem', lineHeight:'1.5' }}>{review.comment}</p>
    </div>
  );
}