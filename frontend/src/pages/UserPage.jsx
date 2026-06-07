/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usersAPI, reviewsAPI } from '../services/api';
import SkillTag from '../components/profile/SkillTag';
import ReviewForm from '../components/profile/ReviewForm';
import ReviewCard from '../components/profile/ReviewCard';
import { useAuth } from '../context/AuthContext';
import SwapRequestModal from '../components/shared/SwapRequestModal';


export default function UserPage() {
  const { id } = useParams();
  const { colors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
const { user } = useAuth();
const [showSwapModal, setShowSwapModal] = useState(false);

  const loadReviews = () => {
    reviewsAPI.getReviews(id).then(({ data }) => setReviews(data.reviews));
  };

useEffect(() => {
    usersAPI.getUser(id).then(({ data }) => setProfile(data.user));
    loadReviews();
  }, [id]);

  if (!profile) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', background:colors.bg }}>
      <p style={{ color:colors.subtext }}>Loading...</p>
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ minHeight:'100vh', background:colors.bg, padding:'2rem' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>

        {/* Profile Header */}
        <div style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', borderRadius:'20px', padding:'2rem', marginBottom:'1.5rem', color:'white', textAlign:'center' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:'800', margin:'0 auto 1rem' }}>
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ margin:'0 0 0.25rem', fontSize:'1.6rem', fontWeight:'800' }}>{profile.name}</h1>
          <p style={{ margin:'0 0 0.5rem', opacity:0.85 }}>{profile.college} • {profile.year}</p>
          {profile.bio && <p style={{ margin:'0 0 1rem', opacity:0.9, fontStyle:'italic' }}>"{profile.bio}"</p>}

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:'2rem' }}>
            {[
              { label:'Rating', value: avgRating > 0 ? `⭐ ${avgRating}` : 'No ratings' },
              { label:'Reviews', value: reviews.length },
              { label:'Swaps', value: profile.swapsCount || 0 },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize:'1.2rem', fontWeight:'800' }}>{stat.value}</div>
                <div style={{ fontSize:'0.8rem', opacity:0.75 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
          <h3 style={{ margin:'0 0 1rem', fontWeight:'700', color:colors.text }}>⚡ Skills</h3>
          <div style={{ marginBottom:'1rem' }}>
            <p style={{ margin:'0 0 0.5rem', fontSize:'0.85rem', fontWeight:'700', color:colors.subtext }}>CAN TEACH</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {profile.skillsHave?.length > 0 ? profile.skillsHave.map(s => <SkillTag key={s} skill={s} color="green" />) : <span style={{ color:'#aaa' }}>None listed</span>}
            </div>
          </div>
          <div>
            <p style={{ margin:'0 0 0.5rem', fontSize:'0.85rem', fontWeight:'700', color:colors.subtext }}>WANTS TO LEARN</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {profile.skillsWant?.length > 0 ? profile.skillsWant.map(s => <SkillTag key={s} skill={s} color="purple" />) : <span style={{ color:'#aaa' }}>None listed</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
<div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
  <Link to={`/chat/${profile._id}`} style={{ flex:1, background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', padding:'0.85rem', borderRadius:'12px', textDecoration:'none', textAlign:'center', fontWeight:'700', fontSize:'1rem' }}>
    💬 Message
  </Link>
  <button onClick={() => setShowSwapModal(true)}
    style={{ flex:1, background:'linear-gradient(135deg, #10b981, #059669)', color:'white', padding:'0.85rem', borderRadius:'12px', border:'none', fontWeight:'700', fontSize:'1rem', cursor:'pointer' }}>
    🤝 Swap Skills
  </button>
  <button onClick={() => setShowReviewForm(!showReviewForm)}
    style={{ flex:1, background: showReviewForm ? '#f0f0f0' : 'white', color: showReviewForm ? '#666' : '#667eea', padding:'0.85rem', borderRadius:'12px', border:'2px solid #667eea', fontWeight:'700', fontSize:'1rem', cursor:'pointer' }}>
    {showReviewForm ? 'Cancel' : '⭐ Review'}
  </button>
</div>

{/* Swap Modal */}
{showSwapModal && (
  <SwapRequestModal
    user={profile}
    currentUser={user}
    onClose={() => setShowSwapModal(false)}
    onSent={() => alert('🎉 Swap request sent!')}
  />
)}

        {/* Review Form */}
        {showReviewForm && (
          <ReviewForm userId={id} onReviewSubmitted={() => { loadReviews(); setShowReviewForm(false); }} />
        )}

        {/* Reviews Section */}
        <div style={{ background:colors.card, borderRadius:'16px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:`1px solid ${colors.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ margin:0, fontWeight:'700', color:colors.text }}>⭐ Reviews ({reviews.length})</h3>
            {avgRating > 0 && (
              <div style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', padding:'0.4rem 1rem', borderRadius:'20px', fontWeight:'700' }}>
                ⭐ {avgRating} / 5
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'#aaa' }}>
              <p style={{ fontSize:'2rem' }}>⭐</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map(r => <ReviewCard key={r._id} review={r} />)
          )}
        </div>

      </div>
    </div>
  );
}