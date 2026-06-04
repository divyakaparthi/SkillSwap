import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar        from './components/shared/Navbar';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage   from './pages/MatchesPage';
import ChatPage      from './pages/ChatPage';
import ProfilePage   from './pages/ProfilePage';
import UserPage      from './pages/UserPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import LandingPage from './pages/LandingPage';

const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>Loading…</div>;
  return user ? children : <Navigate to="/landing" replace />;
};

const Layout = ({ children }) => (
  <Guard>
    <ThemeProvider>
      <NotificationProvider>
        <Navbar />
        <main>{children}</main>
      </NotificationProvider>
    </ThemeProvider>
  </Guard>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/"            element={<Layout><DashboardPage /></Layout>} />
          <Route path="/matches"     element={<Layout><MatchesPage /></Layout>} />
          <Route path="/chat"        element={<Layout><ChatPage /></Layout>} />
          <Route path="/chat/:userId" element={<Layout><ChatPage /></Layout>} />
          <Route path="/profile"     element={<Layout><ProfilePage /></Layout>} />
          <Route path="/user/:id"    element={<Layout><UserPage /></Layout>} />
          <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
          <Route path="/swap-requests" element={<Layout><SwapRequestsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}