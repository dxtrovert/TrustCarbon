import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ role, children }) {
  const { user, profile, loading, error } = useAuth();
  if (loading) return <div className="page-container" role="status">Restoring your session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (error || !profile) {
    return <div className="page-container" role="alert">
      {error || 'Your account profile could not be loaded. Please sign out and try again.'}
    </div>;
  }
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  const { user, profile, signOut } = useAuth();

  return (
    <Router>
      <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <a className="skip-link" href="#main-content">Skip to content</a>

        <Navbar isLoggedIn={Boolean(user)} isAdmin={profile?.role === 'admin'} onLogout={signOut} />

        <main id="main-content" style={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<Home isLoggedIn={Boolean(user)} />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
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
