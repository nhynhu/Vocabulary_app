import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Lesson = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const topicId = searchParams.get('topicId');

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!topicId) {
      setError('Không tìm thấy chủ đề');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy tiến trình học nếu user đã đăng nhập
        if (user) {
          try {
            const progressData = await ApiService.getTopicProgress(topicId);
            setProgress(progressData);
            
            // Nếu chưa hoàn thành lần đầu, redirect về flashcard
            if (!progressData.isCompleted) {
              navigate(`/flashcard?topicId=${topicId}`);
              return;
            }
          } catch (err) {
            console.log('Could not fetch progress:', err);
          }
        }
        
        const wordsData = await ApiService.getVocabularyByTopic(topicId);
        setWords(Array.isArray(wordsData) ? wordsData : []);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        setError('Không thể tải bài học. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId, user, navigate]);

  // Phát âm thanh
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.log('Audio play error:', err));
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải bài học...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Lỗi</Alert.Heading>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate('/topics')}>
              Quay về chủ đề
            </Button>
            <Button variant="outline-danger" className="ms-2" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Bài học từ vựng</h2>
          <p className="text-muted mb-0">
            Có {words.length} từ vựng trong chủ đề này
            {user && progress?.isCompleted && (
              <span className="text-success ms-2">✓ Đã hoàn thành lần đầu</span>
            )}
          </p>
        </div>
        {/* Action Buttons */}
      {words.length > 0 && (
        <div className="text-center mt-5 mb-4">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/flashcard?topicId=${topicId}`)}
            >
              🎴 Luyện tập Flashcard
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => navigate('/topics')}
            >
              Chọn chủ đề khác
            </Button>
          </div>
        </div>
      )}
      </div>

      {/* Word List */}
      {words.length > 0 ? (
        <Row>
          {words.map((word, index) => (
            <Col key={word.vocabId || index} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
                {/* Hình ảnh minh họa */}
                {word.imageUrl && (
                  <Card.Img 
                    variant="top" 
                    src={word.imageUrl.startsWith('http') ? word.imageUrl : `${API_BASE_URL}${word.imageUrl}`}
                    alt={word.word}
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title className="text-primary mb-1" style={{ fontSize: '1.4rem' }}>
                        {word.word}
                      </Card.Title>
                      {word.ipa && (
                        <Card.Subtitle className="mb-2 text-muted">{word.ipa}</Card.Subtitle>
                      )}
                    </div>
                    {/* Nút phát âm */}
                    {word.audioUrl && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="rounded-circle p-2"
                        onClick={(e) => { e.stopPropagation(); playAudio(word.audioUrl); }}
                        title="Nghe phát âm"
                      >
                        🔊
                      </Button>
                    )}
                  </div>
                  
                  <Card.Text className="fw-bold text-dark mt-2" style={{ fontSize: '1.1rem' }}>
                    {word.meaning}
                  </Card.Text>
                  
                  {word.exampleSentence && (
                    <div className="mt-3 pt-2 border-top">
                      <Card.Text className="small fst-italic text-secondary mb-1">
                        "{word.exampleSentence}"
                      </Card.Text>
                      {word.exampleMeaning && (
                        <Card.Text className="small text-muted">
                          → {word.exampleMeaning}
                        </Card.Text>
                      )}
                    </div>
                  )}
                </Card.Body>
                
                {/* Nút luyện tập flashcard cho từ này */}
                <Card.Footer className="bg-transparent border-0 pb-3">
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    className="w-100"
                    onClick={() => navigate(`/flashcard?topicId=${topicId}&wordId=${word.vocabId}`)}
                  >
                    Luyện tập từ này
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          <h5>Chưa có từ vựng nào</h5>
          <p>Chủ đề này chưa có từ vựng. Vui lòng quay lại sau.</p>
        </Alert>
      )}

      {/* CSS for hover effect */}
      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </Container>
  );
};

export default Lesson;