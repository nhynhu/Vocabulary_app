import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import ApiService from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
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

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
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
      console.log('🚀 Bắt đầu đăng ký...', formData);

      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      };

      const result = await ApiService.register(submitData);

      console.log('✅ Đăng ký thành công:', result);
      setSuccess('Đăng ký thành công! Chuyển hướng đến đăng nhập...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error);
      setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Row className="g-0">

        {/* CỘT 1: ẢNH MINH HỌA (Ẩn trên mobile) */}
        <Col lg={6} className="d-none d-lg-block auth-image-side">
          <div className="auth-overlay d-flex flex-column justify-content-center px-5 text-white">
            <div style={{ zIndex: 2 }}>
              <h1 style={{ fontWeight: '800', fontSize: '3.5rem' }}>Tạo Tài Khoản</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Bắt đầu hành trình chinh phục tiếng Anh cùng EngMaster.
              </p>
            </div>
          </div>
        </Col>

        {/* CỘT 2: FORM ĐĂNG KÝ */}
        <Col lg={6} className="auth-form-side">
          <div className="auth-box">
            {/* Logo Mobile */}
            <div className="text-center mb-4 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo192.png" alt="Logo" style={{ width: '50px', marginBottom: '10px' }} />
              <h3 style={{ color: '#123C69', fontWeight: '800' }}>ĐĂNG KÝ</h3>
              <p className="text-muted">Tạo tài khoản mới của bạn</p>
            </div>

            {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}
            {success && <Alert variant="success" className="border-0 shadow-sm">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>Họ Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  className="form-control-modern"
                  placeholder="Nhập họ tên của bạn"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

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
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>Mật khẩu</Form.Label>
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

              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: '#555' }}>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  className="form-control-modern"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
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
                {loading ? <><Spinner size="sm" animation="border" /> Đang xử lý...</> : 'Đăng ký'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted">
                Đã có tài khoản?{' '}
                <span
                  style={{ color: '#123C69', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập ngay
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

export default Signup;
