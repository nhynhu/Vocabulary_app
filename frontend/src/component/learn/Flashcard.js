import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const Flashcard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topicId');
  const wordId = searchParams.get('wordId'); // THÊM DÒNG NÀY

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topicInfo, setTopicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!topicId) {
      setError('Không tìm thấy chủ đề');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy từ vựng theo topic
        const wordsData = await ApiService.getVocabularyByTopic(topicId);
        setWords(wordsData);
        setTopicInfo({ id: topicId, name: `Chủ đề ${topicId}` });

        // Nếu có wordId, set flashcard về đúng vị trí từ đó
        if (wordId) {
          const idx = wordsData.findIndex(w => String(w.id) === String(wordId));
          if (idx >= 0) setCurrentIndex(idx);
        }
      } catch (error) {
        console.error('Error fetching flashcard data:', error);
        setError('Không thể tải flashcard. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId, wordId]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải flashcard...</p>
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
          <Button variant="outline-primary" onClick={() => navigate('/topics')}>
            Quay về chủ đề
          </Button>
        </Alert>
      </Container>
    );
  }

  if (words.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <h5>Chưa có từ vựng</h5>
          <p>Chủ đề này chưa có từ vựng nào để luyện tập.</p>
          <Button variant="primary" onClick={() => navigate('/topics')}>
            Chọn chủ đề khác
          </Button>
        </Alert>
      </Container>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Flashcard: {topicInfo?.nameVi || topicInfo?.name}</h2>
          <p className="text-muted mb-0">
            Thẻ {currentIndex + 1}/{words.length}
          </p>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate(`/lessons?topicId=${topicId}`)}>
          Quay về bài học
        </Button>
      </div>

      {/* Progress */}
      <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />

      {/* Flashcard */}
      <div className="d-flex justify-content-center mb-4">
        <div className="flashcard" onClick={() => setFlipped(!flipped)}>
          <div className={`card-inner ${flipped ? "flipped" : ""}`}>
            <div className="card-front">{currentWord.word}</div>
            <div className="card-back">{currentWord.meaning}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button
          variant="outline-secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size="lg"
        >
          ← Thẻ trước
        </Button>

        <Button
          variant={flipped ? "success" : "primary"}
          onClick={() => setFlipped(!flipped)}
          size="lg"
        >
          {flipped ? "Lật lại" : "Lật thẻ"}
        </Button>

        <Button
          variant="outline-secondary"
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          size="lg"
        >
          Thẻ tiếp →
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <Button
          variant="outline-primary"
          onClick={() => navigate('/topics')}
          size="lg"
        >
          Chọn chủ đề khác
        </Button>
      </div>
    </Container>
  );
};

export default Flashcard;
