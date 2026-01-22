import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const AccountInfo = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'danger', text: 'Mật khẩu mới không khớp!' });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        fullName: formData.fullName
      };

      // Chỉ gửi password nếu người dùng muốn đổi
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await ApiService.updateProfile(updateData);
      
      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Cập nhật thông tin thành công!' });
        setIsEditing(false);
        
        // Cập nhật user trong context nếu có
        if (response.user && updateUser) {
          updateUser(response.user);
        }
        
        // Reset password fields
        setFormData({
          ...formData,
          fullName: response.user?.fullName || formData.fullName,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Cập nhật thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (user?.isGuest) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>Bạn đang ở chế độ khách</Alert.Heading>
          <p>Vui lòng đăng nhập để xem và chỉnh sửa thông tin tài khoản.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/signup')}>
              Đăng ký
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Thông tin tài khoản</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}

              {/* Avatar */}
              <div className="text-center mb-4">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem', fontWeight: 'bold' }}
                >
                  {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
                </div>
                {!isEditing && (
                  <div>
                    <h5 className="mb-1">{user?.fullName || 'Chưa có tên'}</h5>
                    <p className="text-muted mb-0">{user?.email}</p>
                    <small className="text-muted">
                      Vai trò: <span className="badge bg-info">{user?.role || 'USER'}</span>
                    </small>
                  </div>
                )}
              </div>

              {/* Form */}
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">
                      Email không thể thay đổi
                    </Form.Text>
                  </Form.Group>

                  <hr className="my-4" />

                  <h6 className="mb-3">Đổi mật khẩu (Tùy chọn)</h6>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      disabled={loading}
                      onClick={() => {
                        setIsEditing(false);
                        setMessage({ type: '', text: '' });
                        setFormData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                    ✏️ Chỉnh sửa thông tin
                  </Button>
                  <Button variant="outline-info" onClick={() => navigate('/learning-stats')}>
                    📊 Xem thống kê học tập
                  </Button>
                  <Button variant="outline-warning" onClick={() => navigate('/review-words')}>
                    📝 Từ cần ôn tập
                  </Button>
                  <hr />
                  <Button variant="danger" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfo;
