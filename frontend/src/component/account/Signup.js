import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // SỬA LỖI: Chuyển validation messages sang tiếng Anh
  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Starting registration...', formData);

      // Backend yêu cầu field là fullName (camelCase)
      const { confirmPassword, fullname, ...restData } = formData;
      const submitData = {
        ...restData,
        fullName: fullname
      };
      const result = await ApiService.register(submitData);

      console.log('✅ Registration successful:', result);
      setSuccess('Registration successful! You can now sign in.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('❌ Registration error:', error);
      // SỬA LỖI: Hiển thị message lỗi từ server hoặc một message mặc định
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <img
        src="/image/Screenshot 2025-07-09 182720.png"
        alt="VocabMafia Logo"
        className="auth-logo-corner"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />

      <div className="login-container">
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Create Account</h2>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-control"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  Sign in now
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
