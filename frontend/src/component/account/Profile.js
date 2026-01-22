import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Chỉ lấy stats nếu đã đăng nhập
        if (!user?.isGuest) {
          const data = await ApiService.getProfileStats();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
        setError('Không thể tải thông tin. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải thông tin...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">Thông tin tài khoản</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {/* User Info */}
              <div className="text-center mb-4">
                <div 
                  className="bg-secondary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
                </div>
                <h5>{user?.fullName || user?.email || 'Khách'}</h5>
                {user?.email && <p className="text-muted">{user.email}</p>}
                {user?.isGuest && (
                  <Alert variant="info" className="mt-2">
                    Bạn đang sử dụng chế độ khách. Đăng nhập để lưu tiến trình học.
                  </Alert>
                )}
              </div>

              {/* Stats */}
              {stats && !user?.isGuest && (
                <Row className="text-center mb-4">
                  <Col xs={6} className="mb-3">
                    <Card className="h-100 border-primary">
                      <Card.Body className="py-3">
                        <h3 className="text-primary mb-1">{stats.wordsLearned || 0}</h3>
                        <small className="text-muted">Từ đã học</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Card className="h-100 border-success">
                      <Card.Body className="py-3">
                        <h3 className="text-success mb-1">{stats.completedTopics || 0}</h3>
                        <small className="text-muted">Chủ đề hoàn thành</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6}>
                    <Card className="h-100 border-info">
                      <Card.Body className="py-3">
                        <h3 className="text-info mb-1">{stats.avgScore || 0}%</h3>
                        <small className="text-muted">Điểm trung bình</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={6}>
                    <Card className="h-100 border-warning">
                      <Card.Body className="py-3">
                        <h3 className="text-warning mb-1">{stats.streak || 0}</h3>
                        <small className="text-muted">Ngày liên tiếp</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Actions */}
              <div className="d-grid gap-2">
                {user?.isGuest ? (
                  <>
                    <Button variant="primary" onClick={() => navigate('/login')}>
                      Đăng nhập
                    </Button>
                    <Button variant="outline-primary" onClick={() => navigate('/signup')}>
                      Đăng ký
                    </Button>
                  </>
                ) : (
                  <Button variant="danger" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                )}
                <Button variant="outline-secondary" onClick={() => navigate('/')}>
                  Quay về trang chủ
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
