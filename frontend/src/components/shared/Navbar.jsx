import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from './SearchBar';
import OnlineBadge from './OnlineBadge';


export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unread, markAllRead, clearAll } = useNotifications();
  const { isDark, toggleTheme, colors } = useTheme();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const links = [
  { path:'/', label:'Home', emoji:'🏠' },
  { path:'/matches', label:'Matches', emoji:'🎯' },
  { path:'/chat', label:'Chat', emoji:'💬' },
  { path:'/swap-requests', label:'Requests', emoji:'🤝' },
  { path:'/leaderboard', label:'Leaderboard', emoji:'🏆' },
  { path:'/profile', label:'Profile', emoji:'👤' },
];
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: colors.navbar, borderBottom:`1px solid ${colors.border}`,
      padding:'0 2rem', height:'64px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      boxShadow:'0 2px 12px rgba(0,0,0,0.06)', position:'sticky', top:0, zIndex:100
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem' }}>
        <div style={{
          width:'36px', height:'36px', borderRadius:'10px',
          background:'linear-gradient(135deg, #667eea, #764ba2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.1rem'
        }}>🔄</div>
        <span style={{
          fontWeight:'800', fontSize:'1.2rem',
          background:'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
        }}>SkillSwap</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{
            textDecoration:'none', padding:'0.5rem 1rem', borderRadius:'10px',
            fontWeight:'600', fontSize:'0.9rem', transition:'all 0.2s',
            background: isActive(link.path) ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
            color: isActive(link.path) ? 'white' : colors.subtext,
          }}>
            <span style={{ marginRight:'0.3rem' }}>{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <SearchBar />

      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} style={{
          background: isDark ? '#2a2a3e' : '#f0f0f0',
          border:'none', borderRadius:'20px', padding:'0.4rem 0.8rem',
          cursor:'pointer', fontSize:'1rem', transition:'all 0.3s',
          display:'flex', alignItems:'center', gap:'0.4rem'
        }}>
          {isDark ? '☀️' : '🌙'}
          <span style={{ fontSize:'0.8rem', fontWeight:'600', color: isDark ? '#e0e0e0' : '#666' }}>
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Notification Bell */}
        <div style={{ position:'relative' }}>
          <button onClick={() => { setShowNotif(!showNotif); setShowMenu(false); }} style={{
            background:'transparent', border:'none', cursor:'pointer',
            fontSize:'1.3rem', position:'relative', padding:'0.5rem'
          }}>
            🔔
            {unread > 0 && (
              <span style={{
                position:'absolute', top:'2px', right:'2px',
                background:'#e53935', color:'white', borderRadius:'50%',
                width:'18px', height:'18px', fontSize:'0.7rem',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:'700'
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotif && (
            <div style={{
              position:'absolute', top:'calc(100% + 8px)', right:0,
              background: colors.card, borderRadius:'16px',
              boxShadow:'0 8px 25px rgba(0,0,0,0.12)', width:'320px',
              border:`1px solid ${colors.border}`, zIndex:200, overflow:'hidden'
            }}>
              <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${colors.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ margin:0, fontWeight:'700', fontSize:'1rem', color:colors.text }}>🔔 Notifications</h3>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={markAllRead} style={{ background:'none', border:'none', color:'#667eea', cursor:'pointer', fontSize:'0.8rem', fontWeight:'600' }}>Mark all read</button>
                  <button onClick={clearAll} style={{ background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:'0.8rem' }}>Clear</button>
                </div>
              </div>
              <div style={{ maxHeight:'300px', overflowY:'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding:'2rem', textAlign:'center', color:'#aaa' }}>
                    <p style={{ fontSize:'1.5rem' }}>🔔</p>
                    <p style={{ fontSize:'0.9rem' }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{
                      padding:'0.75rem 1.25rem', borderBottom:`1px solid ${colors.border}`,
                      background: n.read ? colors.card : colors.hover,
                      display:'flex', gap:'0.75rem', alignItems:'flex-start'
                    }}>
                      <span style={{ fontSize:'1.2rem' }}>{n.type === 'message' ? '💬' : '🟢'}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:0, fontSize:'0.88rem', color:colors.text, fontWeight: n.read ? '400' : '600' }}>{n.text}</p>
                        <p style={{ margin:'0.2rem 0 0', fontSize:'0.75rem', color:'#aaa' }}>
                          {new Date(n.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                      {!n.read && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#667eea', marginTop:'4px' }} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div style={{ position:'relative' }}>
          <div onClick={() => { setShowMenu(!showMenu); setShowNotif(false); }} style={{
            display:'flex', alignItems:'center', gap:'0.75rem',
            cursor:'pointer', padding:'0.5rem 1rem', borderRadius:'12px',
            border:`2px solid ${colors.border}`, transition:'border-color 0.2s',
          }}>
           <div style={{ position:'relative' }}>
  <div style={{
    width:'32px', height:'32px', borderRadius:'50%',
    background:'linear-gradient(135deg, #667eea, #764ba2)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'white', fontWeight:'700', fontSize:'0.9rem'
  }}>
    {user?.name?.charAt(0).toUpperCase()}
  </div>
  <div style={{ position:'absolute', bottom:'-2px', right:'-2px' }}>
    <OnlineBadge isOnline={true} size={10} />
  </div>
</div>
            <span style={{ fontWeight:'600', color:colors.text, fontSize:'0.9rem' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <span style={{ color:'#aaa', fontSize:'0.8rem' }}>{showMenu ? '▲' : '▼'}</span>
          </div>

          {showMenu && (
            <div style={{
              position:'absolute', top:'calc(100% + 8px)', right:0,
              background:colors.card, borderRadius:'12px', padding:'0.5rem',
              boxShadow:'0 8px 25px rgba(0,0,0,0.12)', minWidth:'180px',
              border:`1px solid ${colors.border}`, zIndex:200
            }}>
              <Link to="/profile" onClick={() => setShowMenu(false)} style={{
                display:'flex', alignItems:'center', gap:'0.75rem',
                padding:'0.75rem 1rem', borderRadius:'8px', textDecoration:'none',
                color:colors.text, fontWeight:'600', fontSize:'0.9rem'
              }}>
                👤 My Profile
              </Link>
              <hr style={{ border:'none', borderTop:`1px solid ${colors.border}`, margin:'0.25rem 0' }} />
              <button onClick={() => { logout(); setShowMenu(false); }} style={{
                width:'100%', display:'flex', alignItems:'center', gap:'0.75rem',
                padding:'0.75rem 1rem', borderRadius:'8px', border:'none',
                background:'transparent', color:'#e53935', fontWeight:'600',
                fontSize:'0.9rem', cursor:'pointer', textAlign:'left'
              }}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}