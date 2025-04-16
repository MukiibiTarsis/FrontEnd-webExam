'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '', // Changed from email to username
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.username && formData.password) { // Changed from email to username
        // TODO: Implement actual authentication logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/dashboard');
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your GCDL account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              Username
            </label>
            <div className="input-group">
              <input
                type="text" // Changed input type from email to text
                name="username" // Changed from email to username
                value={formData.username} // Changed from formData.email to formData.username
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your username" // Updated placeholder
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <a href="#" className="footer-link">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;