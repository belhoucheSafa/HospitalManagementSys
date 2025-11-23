import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Staff } from './pages/Staff';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('hms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('hms_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-sombre-950 text-teal-500">Loading...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={
          !user ? <Login onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> : <Navigate to="/" replace />
        } />
        
        <Route path="/" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Dashboard />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        
        <Route path="/patients" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Patients />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        
        <Route path="/appointments" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Appointments />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/staff" element={
          user ? (
            <Layout user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
              <Staff />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;