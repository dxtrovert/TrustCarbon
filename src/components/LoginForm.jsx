import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLoginSuccess(email || 'demo@trustcarbon.org');
  };

  const handleDemoClick = () => {
    onLoginSuccess('demo@trustcarbon.org');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Access your TrustCarbon analytics dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-field">
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-input"
            required
          />
        </div>

        <div className="login-actions">
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
          
          <button 
            type="button" 
            onClick={handleDemoClick} 
            className="demo-link-btn"
          >
            Continue with Demo
          </button>
        </div>
      </form>
    </div>
  );
}
