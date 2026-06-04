import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.background = isDark ? '#0f0f1a' : '#f8f9ff';
    document.body.style.color = isDark ? '#e0e0e0' : '#333';
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      bg:         isDark ? '#0f0f1a' : '#f8f9ff',
      card:       isDark ? '#1a1a2e' : '#ffffff',
      border:     isDark ? '#2a2a3e' : '#f0f0f0',
      text:       isDark ? '#e0e0e0' : '#333333',
      subtext:    isDark ? '#888888' : '#666666',
      navbar:     isDark ? '#1a1a2e' : '#ffffff',
      input:      isDark ? '#2a2a3e' : '#ffffff',
      inputBorder:isDark ? '#3a3a4e' : '#e8e8e8',
      hover:      isDark ? '#2a2a3e' : '#f8f8ff',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};