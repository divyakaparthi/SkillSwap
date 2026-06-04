import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { emoji:'🎯', title:'Smart Matching', desc:'Our algorithm matches you with the perfect skill swap partner based on what you know and what you want to learn.' },
    { emoji:'💬', title:'Real-time Chat', desc:'Chat instantly with your skill partners. Share resources, schedule sessions, and learn together.' },
    { emoji:'🏆', title:'Earn Badges', desc:'Complete skill swaps and earn achievement badges. Build your reputation as a top mentor!' },
    { emoji:'⭐', title:'Reviews & Ratings', desc:'Rate your skill swap experience and build trust in the community with verified reviews.' },
    { emoji:'🔍', title:'Search Skills', desc:'Find anyone with the skill you need instantly. Search by name, skill, or college.' },
    { emoji:'📄', title:'Export Profile', desc:'Download your SkillSwap profile as a beautiful PDF resume to showcase your skills.' },
  ];

  const steps = [
    { number:'01', title:'Create Profile', desc:'Sign up and list the skills you can teach and the skills you want to learn.', emoji:'👤' },
    { number:'02', title:'Find Matches', desc:'Our smart algorithm finds the perfect skill swap partners for you automatically.', emoji:'🎯' },
    { number:'03', title:'Swap & Grow', desc:'Connect, chat, and start swapping skills. Earn badges as you complete more swaps!', emoji:'🚀' },
  ];

  const testimonials = [
    { name:'Yaswanth', college:'VIT Vellore', text:'SkillSwap helped me learn React in exchange for teaching Python. Best platform for college students!', rating:5, skill:'Python ↔ React' },
    { name:'Jeshwitha', college:'NIT Warangal', text:'I found amazing skill swap partners from different colleges. Highly recommend to every student!', rating:5, skill:'JavaScript ↔ ML' },
    { name:'Rohith', college:'Manipal University', text:'Earned my First Swap badge within a week! The community is super helpful and friendly.', rating:5, skill:'DSA ↔ Web Dev' },
  ];

  const stats = [
    { value:'500+', label:'Students', emoji:'👨‍🎓' },
    { value:'50+', label:'Colleges', emoji:'🏫' },
    { value:'1000+', label:'Skills Listed', emoji:'⚡' },
    { value:'200+', label:'Swaps Done', emoji:'🔄' },
  ];

  return (
    <div style={{ fontFamily:'Inter, Arial, sans-serif', overflowX:'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
        padding:'1rem 2rem', display:'flex', alignItems:'center',
        justifyContent:'space-between', transition:'all 0.3s'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>🔄</div>
          <span style={{ fontWeight:'800', fontSize:'1.2rem', background:'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SkillSwap</span>
        </div>
        <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
          <Link to="/login" style={{ color: scrolled ? '#333' : 'white', textDecoration:'none', fontWeight:'600', fontSize:'0.95rem' }}>Login</Link>
          <Link to="/register" style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', padding:'0.6rem 1.5rem', borderRadius:'25px', textDecoration:'none', fontWeight:'700', fontSize:'0.95rem', boxShadow:'0 4px 15px rgba(102,126,234,0.4)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        textAlign:'center', padding:'2rem', position:'relative', overflow:'hidden'
      }}>
        {/* Background circles */}
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom:'-150px', left:'-150px', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div style={{ maxWidth:'800px', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', padding:'0.5rem 1.5rem', borderRadius:'25px', marginBottom:'1.5rem', color:'white', fontSize:'0.9rem', fontWeight:'600', backdropFilter:'blur(10px)' }}>
            🎓 Built for College Students
          </div>
          <h1 style={{ fontSize:'clamp(2.5rem, 6vw, 4.5rem)', fontWeight:'900', color:'white', margin:'0 0 1.5rem', lineHeight:1.1 }}>
            Learn by Teaching.
            <br />
            <span style={{ opacity:0.9 }}>Grow by Sharing.</span>
          </h1>
          <p style={{ fontSize:'clamp(1rem, 2.5vw, 1.3rem)', color:'rgba(255,255,255,0.9)', margin:'0 0 2.5rem', lineHeight:1.6, maxWidth:'600px', marginLeft:'auto', marginRight:'auto' }}>
            SkillSwap connects college students to exchange skills. You teach what you know, learn what you want. No money needed — just knowledge!
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" style={{ background:'white', color:'#667eea', padding:'1rem 2.5rem', borderRadius:'50px', textDecoration:'none', fontWeight:'800', fontSize:'1.1rem', boxShadow:'0 8px 30px rgba(0,0,0,0.2)', transition:'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🚀 Start Swapping Free
            </Link>
            <Link to="/login" style={{ background:'rgba(255,255,255,0.15)', color:'white', padding:'1rem 2.5rem', borderRadius:'50px', textDecoration:'none', fontWeight:'700', fontSize:'1.1rem', backdropFilter:'blur(10px)', border:'2px solid rgba(255,255,255,0.3)' }}>
              Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ background:'white', padding:'4rem 2rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'2rem', textAlign:'center' }}>
          {stats.map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>{stat.emoji}</div>
              <div style={{ fontSize:'2.5rem', fontWeight:'900', background:'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{stat.value}</div>
              <div style={{ color:'#888', fontWeight:'600', fontSize:'1rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background:'#f8f9ff', padding:'6rem 2rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:'900', color:'#333', margin:'0 0 1rem' }}>
              Everything You Need to <span style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Swap Skills</span>
            </h2>
            <p style={{ color:'#888', fontSize:'1.1rem', maxWidth:'500px', margin:'0 auto' }}>
              Powerful features designed specifically for college students
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem' }}>
            {features.map((feature, i) => (
              <div key={i} style={{ background:'white', borderRadius:'20px', padding:'2rem', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #f0f0f0', transition:'transform 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>{feature.emoji}</div>
                <h3 style={{ margin:'0 0 0.75rem', fontSize:'1.1rem', fontWeight:'800', color:'#333' }}>{feature.title}</h3>
                <p style={{ margin:0, color:'#888', lineHeight:1.6, fontSize:'0.95rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background:'white', padding:'6rem 2rem' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:'900', color:'#333', margin:'0 0 1rem' }}>
              How It Works
            </h2>
            <p style={{ color:'#888', fontSize:'1.1rem' }}>Start swapping skills in 3 simple steps</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'2rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign:'center', position:'relative' }}>
                <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', fontSize:'2rem' }}>
                  {step.emoji}
                </div>
                <div style={{ position:'absolute', top:'28px', left:'0', right:'0', display:'flex', justifyContent:'center' }}>
                  <span style={{ background:'white', color:'#667eea', fontWeight:'900', fontSize:'0.75rem', padding:'0.1rem 0.4rem', borderRadius:'10px', border:'2px solid #667eea' }}>{step.number}</span>
                </div>
                <h3 style={{ margin:'0 0 0.75rem', fontSize:'1.2rem', fontWeight:'800', color:'#333' }}>{step.title}</h3>
                <p style={{ margin:0, color:'#888', lineHeight:1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding:'6rem 2rem' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:'900', color:'white', margin:'0 0 1rem' }}>
              What Students Say
            </h2>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'1.1rem' }}>Join thousands of students already swapping skills</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.5rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.1)', borderRadius:'20px', padding:'2rem', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display:'flex', gap:'4px', marginBottom:'1rem' }}>
                  {Array(t.rating).fill('⭐').map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <p style={{ margin:'0 0 1.5rem', color:'rgba(255,255,255,0.9)', lineHeight:1.6, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin:0, color:'white', fontWeight:'700' }}>{t.name}</p>
                    <p style={{ margin:0, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>{t.college} • {t.skill}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ background:'white', padding:'6rem 2rem', textAlign:'center' }}>
        <div style={{ maxWidth:'600px', margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:'900', color:'#333', margin:'0 0 1rem' }}>
            Ready to Start Swapping? 🚀
          </h2>
          <p style={{ color:'#888', fontSize:'1.1rem', margin:'0 0 2rem' }}>
            Join thousands of college students already exchanging skills on SkillSwap. It's free forever!
          </p>
          <Link to="/register" style={{ display:'inline-block', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', padding:'1.1rem 3rem', borderRadius:'50px', textDecoration:'none', fontWeight:'800', fontSize:'1.1rem', boxShadow:'0 8px 30px rgba(102,126,234,0.4)' }}>
            🎓 Join SkillSwap Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:'#1a1a2e', padding:'3rem 2rem', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginBottom:'1rem' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, #667eea, #764ba2)', display:'flex', alignItems:'center', justifyContent:'center' }}>🔄</div>
          <span style={{ fontWeight:'800', fontSize:'1.1rem', color:'white' }}>SkillSwap</span>
        </div>
        <p style={{ color:'#888', margin:'0 0 0.5rem', fontSize:'0.9rem' }}>
          Peer Skill Exchange Platform for College Students
        </p>
        <p style={{ color:'#555', margin:0, fontSize:'0.85rem' }}>
          © 2026 SkillSwap. Built with ❤️ for college students.
        </p>
      </div>

    </div>
  );
}