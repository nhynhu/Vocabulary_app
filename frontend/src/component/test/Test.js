import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const Test = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllTopics();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setError('Không thể tải danh sách chủ đề. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicId) => {
    navigate(`/test-list?topicId=${topicId}`);
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải chủ đề...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>⚠️ Lỗi kết nối</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2>Chọn chủ đề để làm bài test</h2>
        <p className="text-muted">Có {topics.length} chủ đề để kiểm tra kiến thức</p>
      </div>

      <Row>
        {topics.length > 0 ? (
          topics.map((topic) => (
            <Col key={topic.id} lg={4} md={6} sm={12} className="mb-4">
              <Card className="h-100 shadow-sm card-equal" style={{ cursor: 'pointer' }} onClick={() => handleTopicClick(topic.id)}>
                <Card.Img
                  variant="top"
                  src={topic.image ? `http://localhost:3000${topic.image}` : '/image/testchoose.jpg'}
                  onError={(e) => { e.target.src = '/image/testchoose.jpg'; }}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{topic.name}</Card.Title>
                  <Card.Text>Làm bài test chủ đề {topic.name}</Card.Text>
                  <Button variant="primary">Xem bài test</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              <h5>📝 Chưa có chủ đề nào</h5>
              <p>Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Test;