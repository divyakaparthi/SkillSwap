import React, { useState } from 'react';
import { reviewsAPI } from '../../services/api';

export default function ReviewForm({ userId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [skillTag, setSkillTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating!'); return; }
    if (!comment.trim()) { setError('Please write a comment!'); return; }
    setLoading(true);
    try {
      await reviewsAPI.create(userId, { rating, comment, skillTag });
      setRating(0);
      setComment('');
      setSkillTag('');
      setError('');
      onReviewSubmitted && onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#f8f8ff', borderRadius:'12px', padding:'1.25rem', marginBottom:'1rem', border:'1px solid #e8e8ff' }}>
      <h4 style={{ margin:'0 0 1rem', fontWeight:'700', color:'#333' }}>✍️ Write a Review</h4>

      {error && (
        <div style={{ background:'#fff0f0', border:'1px solid #ffcdd2', borderRadius:'8px', padding:'0.5rem 1rem', marginBottom:'1rem', color:'#e53935', fontSize:'0.9rem' }}>
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div style={{ marginBottom:'1rem' }}>
        <p style={{ margin:'0 0 0.5rem', fontWeight:'600', color:'#555', fontSize:'0.9rem' }}>Rating</p>
        <div style={{ display:'flex', gap:'0.25rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background:'none', border:'none', cursor:'pointer',
                fontSize:'2rem', padding:'0',
                color: star <= (hover || rating) ? '#fbbf24' : '#e0e0e0',
                transition:'color 0.15s, transform 0.15s',
                transform: star <= (hover || rating) ? 'scale(1.2)' : 'scale(1)',
              }}>★</button>
          ))}
          {rating > 0 && (
            <span style={{ marginLeft:'0.5rem', color:'#667eea', fontWeight:'700', fontSize:'0.9rem', alignSelf:'center' }}>
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Skill Tag */}
      <div style={{ marginBottom:'1rem' }}>
        <p style={{ margin:'0 0 0.5rem', fontWeight:'600', color:'#555', fontSize:'0.9rem' }}>Skill Swapped</p>
        <input value={skillTag} onChange={e => setSkillTag(e.target.value)}
          placeholder="e.g. Python, React, DSA..."
          style={{ width:'100%', padding:'0.75rem 1rem', border:'2px solid #e8e8e8', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor = '#667eea'}
          onBlur={e => e.target.style.borderColor = '#e8e8e8'}
        />
      </div>

      {/* Comment */}
      <div style={{ marginBottom:'1rem' }}>
        <p style={{ margin:'0 0 0.5rem', fontWeight:'600', color:'#555', fontSize:'0.9rem' }}>Comment</p>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this skill swap..."
          rows={3}
          style={{ width:'100%', padding:'0.75rem 1rem', border:'2px solid #e8e8e8', borderRadius:'10px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'inherit' }}
          onFocus={e => e.target.style.borderColor = '#667eea'}
          onBlur={e => e.target.style.borderColor = '#e8e8e8'}
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{ width:'100%', padding:'0.85rem', background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'10px', fontSize:'1rem', fontWeight:'700', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Submitting...' : '⭐ Submit Review'}
      </button>
    </div>
  );
}