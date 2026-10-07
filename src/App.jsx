import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('trustcarbon_logged_in') === 'true';
    const email = localStorage.getItem('trustcarbon_email') || '';
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, []);

  const handleLoginSuccess = (email) => {
    localStorage.setItem('trustcarbon_logged_in', 'true');
    localStorage.setItem('trustcarbon_email', email);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('trustcarbon_logged_in');
    localStorage.removeItem('trustcarbon_email');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Router>
      <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <a className="skip-link" href="#main-content">Skip to content</a>

        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main id="main-content" style={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/login"
              element={<Login isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            {/* Redirect old routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
