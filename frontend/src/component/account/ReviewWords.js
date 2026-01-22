import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ReviewWords = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviewWords = async () => {
      try {
        setLoading(true);
        if (!user?.isGuest) {
          const data = await ApiService.getReviewWords();
          setWords(data || []);
        } else {
          setError('Vui lòng đăng nhập để xem danh sách từ cần ôn');
        }
      } catch (error) {
        console.error('Error fetching review words:', error);
        setError('Không thể tải danh sách từ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewWords();
  }, [user]);

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.log('Audio play error:', err));
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải danh sách từ...</p>
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
          <p>Vui lòng đăng nhập để xem danh sách từ cần ôn tập.</p>
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
        <div>
          <h2 className="mb-1">📝 Từ cần ôn tập</h2>
          <p className="text-muted mb-0">
            {words.length > 0 
              ? `Bạn có ${words.length} từ cần ôn tập` 
              : 'Chưa có từ nào cần ôn tập'}
          </p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/learning-stats')}>
          ← Quay lại
        </Button>
      </div>

      {/* Info Card */}
      <Alert variant="info" className="mb-4">
        <div className="d-flex align-items-start">
          <div className="me-3" style={{ fontSize: '2rem' }}>💡</div>
          <div>
            <strong>Từ cần ôn tập là gì?</strong>
            <p className="mb-0 mt-1">
              Đây là những từ bạn đã sai nhiều lần trong các bài kiểm tra hoặc những từ bạn đã đánh dấu để ôn lại.
              Hãy dành thời gian ôn tập những từ này để cải thiện vốn từ vựng!
            </p>
          </div>
        </div>
      </Alert>

      {/* Words List */}
      {words.length === 0 ? (
        <Card className="shadow-sm text-center p-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h4>Tuyệt vời!</h4>
          <p className="text-muted">Bạn chưa có từ nào cần ôn tập. Tiếp tục học và làm bài kiểm tra nhé!</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="primary" onClick={() => navigate('/topics')}>
              📚 Học bài mới
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/test')}>
              ✍️ Làm bài test
            </Button>
          </div>
        </Card>
      ) : (
        <Row>
          {words.map((item, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow" style={{ transition: 'all 0.3s' }}>
                <Card.Body>
                  {/* Image */}
                  {(item.imageURL || item.imageUrl || item.imgURL) && (
                    <div className="text-center mb-3">
                      <img 
                        src={(item.imageURL || item.imageUrl || item.imgURL).startsWith('http') 
                          ? (item.imageURL || item.imageUrl || item.imgURL)
                          : `${API_BASE_URL}${item.imageURL || item.imageUrl || item.imgURL}`}
                        alt={item.word}
                        style={{ 
                          maxWidth: '100%', 
                          height: '150px', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Word */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0 text-primary">{item.word}</h5>
                    {item.errorCount > 0 && (
                      <Badge bg="danger" pill>
                        Sai {item.errorCount}x
                      </Badge>
                    )}
                    {item.isMarked && (
                      <Badge bg="warning" pill>
                        ⭐ Đã đánh dấu
                      </Badge>
                    )}
                  </div>

                  {/* IPA */}
                  {item.ipa && (
                    <p className="text-muted mb-2">
                      <small>{item.ipa}</small>
                    </p>
                  )}

                  {/* Meaning */}
                  <p className="mb-2">
                    <strong>Nghĩa:</strong> {item.meaning}
                  </p>

                  {/* Example */}
                  {item.exampleSentence && (
                    <div className="mb-3">
                      <small className="text-muted">Ví dụ:</small>
                      <p className="mb-1 fst-italic">
                        <small>"{item.exampleSentence}"</small>
                      </p>
                      {item.exampleMeaning && (
                        <p className="mb-0 text-muted">
                          <small>"{item.exampleMeaning}"</small>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    {(item.audioURL || item.audioUrl) && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => playAudio(item.audioURL || item.audioUrl)}
                      >
                        🔊 Nghe
                      </Button>
                    )}
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => navigate(`/flashcard?topicId=${item.topicId}&wordId=${item.vocabId}`)}
                    >
                      🎴 Luyện tập
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Bottom Actions */}
      {words.length > 0 && (
        <Card className="shadow-sm mt-4">
          <Card.Body>
            <h6 className="mb-3">Bạn muốn làm gì tiếp theo?</h6>
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                variant="primary"
                onClick={() => {
                  // Luyện tập flashcard với từ đầu tiên
                  if (words[0]) {
                    navigate(`/flashcard?topicId=${words[0].topicId}&wordId=${words[0].vocabId}`);
                  }
                }}
              >
                🎴 Luyện tập tất cả
              </Button>
              <Button 
                variant="outline-success"
                onClick={() => navigate('/topics')}
              >
                📚 Học bài mới
              </Button>
              <Button 
                variant="outline-info"
                onClick={() => navigate('/test')}
              >
                ✍️ Làm bài test
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* CSS for hover effect */}
      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </Container>
  );
};

export default ReviewWords;
