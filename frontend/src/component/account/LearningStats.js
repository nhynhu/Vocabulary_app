import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const LearningStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        if (!user?.isGuest) {
          const data = await ApiService.getProfileStats();
          setStats(data);
        } else {
          setError('Vui lòng đăng nhập để xem thống kê');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Không thể tải thống kê. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải thống kê...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (user?.isGuest) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>Bạn đang ở chế độ khách</Alert.Heading>
          <p>Vui lòng đăng nhập để xem thống kê học tập của bạn.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📊 Thống kê học tập</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/profile')}>
          ← Quay lại
        </Button>
      </div>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="display-4 mb-2">📚</div>
              <h2 className="text-primary mb-1">{stats?.wordsLearned || 0}</h2>
              <p className="text-muted mb-0">Từ đã học</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="display-4 mb-2">✅</div>
              <h2 className="text-success mb-1">{stats?.completedTopics || 0}</h2>
              <p className="text-muted mb-0">Bài đã học xong</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="display-4 mb-2">📝</div>
              <h2 className="text-info mb-1">{stats?.totalTests || 0}</h2>
              <p className="text-muted mb-0">Bài kiểm tra đã làm</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="display-4 mb-2">⭐</div>
              <h2 className="text-warning mb-1">{stats?.avgScore || 0}%</h2>
              <p className="text-muted mb-0">Điểm trung bình</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Stats */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Tiến độ học tập</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Từ vựng đã học</span>
                  <strong>{stats?.wordsLearned || 0} từ</strong>
                </div>
                <ProgressBar 
                  now={(stats?.wordsLearned || 0) / 10} 
                  variant="primary" 
                  style={{ height: '10px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Chủ đề hoàn thành</span>
                  <strong>{stats?.completedTopics || 0} bài</strong>
                </div>
                <ProgressBar 
                  now={(stats?.completedTopics || 0) * 10} 
                  variant="success" 
                  style={{ height: '10px' }}
                />
              </div>

              <div className="mb-0">
                <div className="d-flex justify-content-between mb-2">
                  <span>Điểm trung bình</span>
                  <strong>{stats?.avgScore || 0}%</strong>
                </div>
                <ProgressBar 
                  now={stats?.avgScore || 0} 
                  variant="warning" 
                  style={{ height: '10px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Thành tích</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                <div className="me-3" style={{ fontSize: '2rem' }}>🔥</div>
                <div>
                  <h6 className="mb-0">Streak {stats?.streak || 0} ngày</h6>
                  <small className="text-muted">Học liên tiếp</small>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                <div className="me-3" style={{ fontSize: '2rem' }}>🏆</div>
                <div>
                  <h6 className="mb-0">{stats?.completedTopics || 0} chủ đề</h6>
                  <small className="text-muted">Đã hoàn thành</small>
                </div>
              </div>

              <div className="d-flex align-items-center p-3 bg-light rounded">
                <div className="me-3" style={{ fontSize: '2rem' }}>📈</div>
                <div>
                  <h6 className="mb-0">{stats?.totalTests || 0} bài test</h6>
                  <small className="text-muted">Đã hoàn thành</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Hành động nhanh</h5>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/topics')}
            >
              📚 Tiếp tục học
            </Button>
            <Button 
              variant="outline-warning" 
              onClick={() => navigate('/review-words')}
            >
              📝 Ôn tập từ đã sai
            </Button>
            <Button 
              variant="outline-info" 
              onClick={() => navigate('/test')}
            >
              ✍️ Làm bài kiểm tra
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LearningStats;
