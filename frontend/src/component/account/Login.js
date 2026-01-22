import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api'; // Đảm bảo đường dẫn đúng

const GOOGLE_CLIENT_ID = '363735340206-66gn8abl1cacbqj5resrp39ugg67q14t.apps.googleusercontent.com';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Login handler
  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    setError('');
    try {
      console.log('🚀 Google login response:', response);
      const result = await ApiService.googleLogin(response.credential);
      login(result.user, result.token);
      if (result.user?.userId) {
        localStorage.setItem('userId', result.user.userId);
      }
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('❌ Google login error:', error);
      setError(error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) return setError('Vui lòng nhập email');
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError('Email không hợp lệ');
    if (!formData.password.trim()) return setError('Vui lòng nhập mật khẩu');
    if (formData.password.length < 6) return setError('Mật khẩu phải từ 6 ký tự');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Starting login...', { email: formData.email });
      const result = await ApiService.login(formData);

      login(result.user, result.token);

      if (result.user?.userId) {
        localStorage.setItem('userId', result.user.userId);
      }

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (error.message.includes('network')) {
        setError('Không thể kết nối đến máy chủ.');
      } else {
        setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <Row className="g-0 justify-content-center w-100">

        {/* --- FORM ĐĂNG NHẬP --- */}
        <Col lg={5} md={8} sm={10} className="auth-form-side">
          <div className="auth-box">
            {/* Logo Mobile */}
            <div className="text-center mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo192.png" alt="Logo" style={{ width: '50px', marginBottom: '10px' }} />
              <h3 style={{ color: '#123C69', fontWeight: '800' }}>ĐĂNG NHẬP</h3>
              <p className="text-muted">Nhập thông tin tài khoản của bạn</p>
            </div>

            {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="form-control-modern"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between">
                  <Form.Label style={{ fontWeight: '600', color: '#555' }}>Mật khẩu</Form.Label>
                  <span
                    style={{ color: '#AC3B61', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                    onClick={() => navigate('/forgot-password')}
                  >
                    Quên mật khẩu?
                  </span>
                </div>
                <Form.Control
                  type="password"
                  name="password"
                  className="form-control-modern"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#AC3B61',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 5px 15px rgba(172, 59, 97, 0.3)'
                }}
              >
                {loading ? <><Spinner size="sm" animation="border" /> Đang xử lý...</> : 'Đăng nhập'}
              </Button>
            </Form>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />
              <span className="px-3 text-muted" style={{ fontSize: '0.9rem' }}>hoặc</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Google Sign In Button */}
            <div className="mb-3">
              <div id="google-signin-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>
              {googleLoading && (
                <div className="text-center mt-2">
                  <Spinner size="sm" animation="border" /> Đang xử lý...
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <p className="text-muted">
                Chưa có tài khoản?{' '}
                <span
                  style={{ color: '#123C69', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate('/signup')}
                >
                  Đăng ký ngay
                </span>
              </p>
            </div>

            {/* Nút quay lại trang chủ */}
            <div className="text-center mt-3">
              <span
                style={{ color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' }}
                onClick={() => navigate('/')}
              >
                Quay lại trang chủ
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;