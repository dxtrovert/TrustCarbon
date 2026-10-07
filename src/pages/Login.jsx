import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function Login({ isLoggedIn, onLoginSuccess }) {
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="page-container">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
