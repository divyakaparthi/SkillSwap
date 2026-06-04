import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getSocket } from '../services/socket';
import MessageBubble from '../components/chat/MessageBubble';
import ConversationList from '../components/chat/ConversationList';

export default function ChatPage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTyping]);

  // Load conversations
  useEffect(() => {
    chatAPI.getConversations().then(({ data }) => setConversations(data.conversations));
  }, []);

  // Load messages & setup socket
  useEffect(() => {
    if (!userId) return;
    chatAPI.getHistory(userId).then(({ data }) => setMessages(data.messages));
    chatAPI.markRead(userId);

    const socket = getSocket();
    if (!socket) return;

    // Join room
    socket.emit('chat:join', { peerId: userId });

    // Listen for new messages
    socket.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Listen for typing
    socket.on('chat:typing', ({ userId: typingUserId }) => {
      if (typingUserId === userId) setPeerTyping(true);
    });

    socket.on('chat:stopTyping', ({ userId: typingUserId }) => {
      if (typingUserId === userId) setPeerTyping(false);
    });

    return () => {
      socket.off('chat:message');
      socket.off('chat:typing');
      socket.off('chat:stopTyping');
    };
  }, [userId]);

  // Handle typing
  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket || !userId) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('chat:typing', { peerId: userId });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('chat:stopTyping', { peerId: userId });
    }, 1500);
  };

  const send = async () => {
    if (!text.trim()) return;
    const socket = getSocket();

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      socket?.emit('chat:stopTyping', { peerId: userId });
      clearTimeout(typingTimeoutRef.current);
    }

    const { data } = await chatAPI.sendMessage(userId, text);
    setMessages(prev => [...prev, data.message]);
    setText('');
  };

  return (
    <div style={{ display:'flex', height:'calc(100vh - 64px)', background:colors.bg }}>
      {/* Sidebar */}
      <div style={{ width:'300px', borderRight:`1px solid ${colors.border}`, overflowY:'auto', background:colors.card }}>
        <div style={{ padding:'1rem 1.5rem', borderBottom:`1px solid ${colors.border}` }}>
          <h3 style={{ margin:0, fontWeight:'700', color:colors.text }}>💬 Chats</h3>
        </div>
        <ConversationList conversations={conversations} currentUserId={user?._id} />
      </div>

      {/* Chat Area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', background:colors.bg }}>
        {!userId ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:colors.subtext }}>
            <p style={{ fontSize:'3rem' }}>👈</p>
            <p style={{ fontWeight:'600' }}>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>
              {messages.map(m => (
                <MessageBubble key={m._id} message={m} isOwn={m.sender?._id === user?._id || m.sender === user?._id} />
              ))}

              {/* Typing Indicator */}
              {peerTyping && (
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
                  <div style={{
                    width:'32px', height:'32px', borderRadius:'50%',
                    background:'linear-gradient(135deg, #667eea, #764ba2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'white', fontWeight:'700', fontSize:'0.85rem', flexShrink:0
                  }}>...</div>
                  <div style={{
                    background: colors.card, padding:'0.75rem 1rem',
                    borderRadius:'18px 18px 18px 4px',
                    boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
                    display:'flex', alignItems:'center', gap:'4px'
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width:'8px', height:'8px', borderRadius:'50%',
                        background:'#667eea',
                        animation:'bounce 1.2s infinite',
                        animationDelay:`${i * 0.2}s`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding:'1rem 1.5rem', background:colors.card, borderTop:`1px solid ${colors.border}`, display:'flex', gap:'0.75rem', alignItems:'center' }}>
              <input
                value={text}
                onChange={handleTyping}
                onKeyPress={e => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                style={{ flex:1, padding:'0.85rem 1rem', border:`2px solid ${colors.inputBorder}`, borderRadius:'12px', fontSize:'1rem', outline:'none', background:colors.input, color:colors.text }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = colors.inputBorder}
              />
              <button onClick={send} style={{ background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', padding:'0.85rem 1.5rem', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'700', fontSize:'1rem' }}>
                Send →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}