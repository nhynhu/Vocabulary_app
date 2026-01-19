import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import TopicCard from './TopicCard';
import ApiService from '../../services/api';

const Topic = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <Alert.Heading>Lỗi kết nối</Alert.Heading>
          <p>
            Không thể tải danh sách chủ đề. Dịch vụ có thể đang gặp sự cố.
            <br />
            Vui lòng thử lại sau.
          </p>
          <hr />
          <p className="mb-0 fst-italic small">
            Chi tiết lỗi: {error}
          </p>
          <Button variant="outline-danger" onClick={() => window.location.reload()} className="mt-3">
            Thử lại
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2>Chọn chủ đề học từ vựng</h2>
        <p className="text-muted">Có {topics.length} chủ đề để bạn khám phá</p>
      </div>

      <Row>
        {topics.length > 0 ? (
          topics.map((topic) => {
            console.log(`🔍 Topic image URL: ${topic.image}`); // SỬA LỖI: Debug URL

            return (
              <Col key={topic.id} lg={4} md={6} sm={12} className="mb-4">
                <TopicCard
                  title={topic.nameVi || topic.name}
                  img={topic.image ? `http://localhost:3000${topic.image}` : 'http://localhost:3000/uploads/default-topic.jpg'}
                  text={topic.description || `Học từ vựng về ${topic.nameVi || topic.name}`}
                  topicId={topic.id}
                  wordCount={topic.wordCount}
                />
              </Col>
            );
          })
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              <h5>Chưa có chủ đề nào</h5>
              <p>Hệ thống đang được cập nhật. Vui lòng quay lại sau.</p>
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Topic;