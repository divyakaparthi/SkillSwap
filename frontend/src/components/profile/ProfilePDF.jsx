import React, { useRef } from 'react';

export default function ProfilePDF({ user }) {
  const pdfRef = useRef(null);

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = pdfRef.current;

    // Make visible temporarily
    element.style.position = 'relative';
    element.style.left = '0';
    element.style.top = '0';

    const opt = {
      margin: 0,
      filename: `${user.name}_SkillSwap_Profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();

    // Hide again
    element.style.position = 'absolute';
    element.style.left = '-9999px';
  };

  const badgeColors = {
    'First Swap':     '#ffd700',
    'Active Learner': '#42a5f5',
    'Skill Champion': '#ab47bc',
    'Top Mentor':     '#ef5350',
  };

  return (
    <div>
      {/* Download Button */}
      <button onClick={downloadPDF} style={{
        width:'100%', padding:'1rem',
        background:'linear-gradient(135deg, #f093fb, #f5576c)',
        color:'white', border:'none', borderRadius:'12px',
        fontSize:'1rem', fontWeight:'700', cursor:'pointer',
        marginBottom:'1.5rem', display:'flex', alignItems:'center',
        justifyContent:'center', gap:'0.5rem'
      }}>
        📄 Download Profile as PDF
      </button>

      {/* PDF Content */}
      <div ref={pdfRef} style={{
        width:'794px',
        background:'white',
        fontFamily:'Arial, sans-serif',
        position:'absolute',
        left:'-9999px',
        top:'0',
        zIndex:'-1'
      }}>
        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'40px', color:'white', textAlign:'center'
        }}>
          <div style={{
            width:'80px', height:'80px', borderRadius:'50%',
            background:'rgba(255,255,255,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2rem', fontWeight:'800', margin:'0 auto 16px',
            border:'3px solid rgba(255,255,255,0.5)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ margin:'0 0 8px', fontSize:'28px', fontWeight:'800' }}>{user?.name}</h1>
          <p style={{ margin:'0 0 4px', opacity:0.9, fontSize:'14px' }}>{user?.email}</p>
          <p style={{ margin:'0 0 16px', opacity:0.8, fontSize:'13px' }}>{user?.college} • {user?.year}</p>
          {user?.bio && (
            <p style={{ margin:0, opacity:0.9, fontSize:'14px', fontStyle:'italic' }}>"{user?.bio}"</p>
          )}
        </div>

        {/* Stats Bar */}
        <div style={{ display:'flex', background:'#f8f9ff', borderBottom:'2px solid #e8e8ff' }}>
          {[
            { label:'Rating', value: user?.rating || '0', emoji:'⭐' },
            { label:'Reviews', value: user?.reviewCount || '0', emoji:'📝' },
            { label:'Swaps', value: user?.swapsCount || '0', emoji:'🔄' },
            { label:'Skills', value: user?.skillsHave?.length || '0', emoji:'⚡' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ flex:1, padding:'16px', textAlign:'center', borderRight: i < 3 ? '1px solid #e8e8ff' : 'none' }}>
              <div style={{ fontSize:'20px', marginBottom:'4px' }}>{stat.emoji}</div>
              <div style={{ fontSize:'20px', fontWeight:'800', color:'#667eea' }}>{stat.value}</div>
              <div style={{ fontSize:'11px', color:'#888' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ padding:'32px' }}>

          {/* Skills I Can Teach */}
          <div style={{ marginBottom:'24px' }}>
            <h2 style={{ margin:'0 0 12px', fontSize:'16px', fontWeight:'800', color:'#333', borderBottom:'2px solid #667eea', paddingBottom:'8px' }}>
              ⚡ Skills I Can Teach
            </h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {user?.skillsHave?.length > 0
                ? user.skillsHave.map(skill => (
                  <span key={skill} style={{ background:'#e8f5e9', color:'#2e7d32', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' }}>
                    {skill}
                  </span>
                ))
                : <p style={{ color:'#aaa', fontSize:'13px', margin:0 }}>No skills listed</p>}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div style={{ marginBottom:'24px' }}>
            <h2 style={{ margin:'0 0 12px', fontSize:'16px', fontWeight:'800', color:'#333', borderBottom:'2px solid #764ba2', paddingBottom:'8px' }}>
              🎯 Skills I Want to Learn
            </h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {user?.skillsWant?.length > 0
                ? user.skillsWant.map(skill => (
                  <span key={skill} style={{ background:'#f3e5f5', color:'#7b1fa2', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' }}>
                    {skill}
                  </span>
                ))
                : <p style={{ color:'#aaa', fontSize:'13px', margin:0 }}>No skills listed</p>}
            </div>
          </div>

          {/* Badges */}
          {user?.badges?.length > 0 && (
            <div style={{ marginBottom:'24px' }}>
              <h2 style={{ margin:'0 0 12px', fontSize:'16px', fontWeight:'800', color:'#333', borderBottom:'2px solid #ffd700', paddingBottom:'8px' }}>
                🏆 Badges & Achievements
              </h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {user.badges.map(badge => (
                  <span key={badge} style={{ background:'#fffde7', color: badgeColors[badge] || '#666', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', border:`1px solid ${badgeColors[badge] || '#e0e0e0'}` }}>
                    🏅 {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {user?.bio && (
            <div style={{ marginBottom:'24px' }}>
              <h2 style={{ margin:'0 0 12px', fontSize:'16px', fontWeight:'800', color:'#333', borderBottom:'2px solid #10b981', paddingBottom:'8px' }}>
                👤 About Me
              </h2>
              <p style={{ margin:0, color:'#555', fontSize:'14px', lineHeight:'1.6' }}>{user.bio}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop:'32px', padding:'16px', background:'#f8f9ff', borderRadius:'12px', textAlign:'center', border:'1px solid #e8e8ff' }}>
            <p style={{ margin:0, color:'#667eea', fontWeight:'800', fontSize:'16px' }}>🔄 SkillSwap</p>
            <p style={{ margin:'4px 0 0', color:'#888', fontSize:'11px' }}>
              Generated on {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
            </p>
            <p style={{ margin:'4px 0 0', color:'#888', fontSize:'11px' }}>
              Peer Skill Exchange Platform for College Students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}