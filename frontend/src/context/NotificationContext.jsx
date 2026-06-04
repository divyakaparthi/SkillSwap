import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    socket.on('chat:message', (msg) => {
      if (msg.sender._id !== user._id) {
        const notif = {
          id: Date.now(),
          type: 'message',
          text: `${msg.sender.name}: ${msg.text}`,
          time: new Date(),
          read: false,
        };
        setNotifications(prev => [notif, ...prev].slice(0, 20));
        setUnread(prev => prev + 1);
      }
    });

    socket.on('user:online', ({ userId }) => {
      const notif = {
        id: Date.now(),
        type: 'online',
        text: 'A user came online!',
        time: new Date(),
        read: false,
      };
      setNotifications(prev => [notif, ...prev].slice(0, 20));
    });

    return () => {
      socket.off('chat:message');
      socket.off('user:online');
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnread(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unread, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};