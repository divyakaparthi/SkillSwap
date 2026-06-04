import { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';

export default function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('user:online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, []);

  const isOnline = (userId) => onlineUsers.has(userId);

  return { onlineUsers, isOnline };
}