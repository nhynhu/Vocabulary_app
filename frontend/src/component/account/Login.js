import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api'; // Đảm bảo đường dẫn đúng

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      if (result.user?.id) {
        localStorage.setItem('userId', result.user.id);
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
    <div className="auth-wrapper">
      <Row className="g-0"> {/* g-0 để bỏ khoảng cách giữa 2 cột */}

        {/* --- CỘT 1: ẢNH MINH HỌA (Ẩn trên mobile) --- */}
        <Col lg={6} className="d-none d-lg-block auth-image-side">
          <div className="auth-overlay d-flex flex-column justify-content-center px-5 text-white">
            <div style={{ zIndex: 2 }}>
              <h1 style={{ fontWeight: '800', fontSize: '3.5rem' }}>Welcome Back!</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Tiếp tục hành trình chinh phục tiếng Anh cùng EngMaster.
              </p>
            </div>
          </div>
        </Col>

        {/* --- CỘT 2: FORM ĐĂNG NHẬP --- */}
        <Col lg={6} className="auth-form-side">
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
                ← Quay lại trang chủ
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;