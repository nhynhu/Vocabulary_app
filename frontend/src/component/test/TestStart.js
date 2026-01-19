import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const TestStart = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const testId = searchParams.get('testId');

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if (!testId) {
      setError('Không tìm thấy bài test');
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getTestById(testId);
        // Backend trả về test với questions là mảng
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Không thể tải câu hỏi. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    // Bắt đầu đếm thời gian khi vào bài test
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // Chuẩn hóa answers theo format backend yêu cầu
      const answersArray = questions.map(q => ({
        questionId: q.id,
        userAnswer: selectedAnswers[q.id] ?? null
      }));
      const response = await ApiService.submitTest({
        testId: parseInt(testId),
        answers: answersArray,
        flaggedQuestions: []
      });
      // Backend trả về {score, message}
      setResult({
        score: Object.keys(selectedAnswers).length,
        totalQuestions: questions.length,
        percentage: response.score || 0
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        setError('Bạn cần đăng nhập để nộp bài. Vui lòng đăng nhập và thử lại.');
      } else {
        setError('Không thể nộp bài. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải câu hỏi...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>⚠️ Lỗi</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={() => navigate('/test')}>
            Quay về danh sách test
          </Button>
        </Alert>
      </Container>
    );
  }

  if (result) {
    const passed = result.percentage >= 70;
    return (
      <Container className="mt-5">
        <Card className="text-center shadow">
          <Card.Body className="p-5">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              {passed ? '🎉' : '😅'}
            </div>
            <h2>{passed ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}</h2>

            <div className="my-4">
              <h3 className={passed ? 'text-success' : 'text-warning'}>
                {result.score}/{result.totalQuestions} câu đúng
              </h3>
              <h4 className={passed ? 'text-success' : 'text-warning'}>
                Điểm: {result.percentage}%
              </h4>
            </div>

            <p className="lead">
              {passed
                ? 'Bạn đã vượt qua bài test! Tiếp tục phát huy nhé!'
                : 'Đừng nản lòng! Hãy ôn tập thêm và thử lại.'
              }
            </p>

            <div className="d-flex gap-2 justify-content-center flex-wrap mt-4">
              <Button variant="primary" onClick={() => navigate('/test')}>
                📝 Làm bài test khác
              </Button>
              <Button variant="success" onClick={() => navigate('/topics')}>
                📚 Học từ vựng
              </Button>
              <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                🔄 Làm lại bài này
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <h5>📝 Bài test trống</h5>
          <p>Bài test này chưa có câu hỏi nào.</p>
          <Button variant="primary" onClick={() => navigate('/test')}>
            Chọn bài test khác
          </Button>
        </Alert>
      </Container>
    );
  }

  const question = questions[currentQuestion];
  // Backend lưu answers dưới dạng JSON string hoặc mảng
  const options = Array.isArray(question?.answers) ? question.answers : JSON.parse(question?.answers || '[]');

  return (
    <Container className="mt-4">
      {/* Timer */}
      <div className="mb-4 text-center">
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          ⏰ Thời gian: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Question */}
      <Card className="shadow">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Câu {currentQuestion + 1}/{questions.length}</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <h4 className="mb-4">{question?.content}</h4>

          <div className="mt-3">
            {options?.map((option, index) => (
              <div key={index} className="mb-3">
                <div className="form-check">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${question.id}`}
                    value={index}
                    checked={selectedAnswers[question.id] === index}
                    onChange={() => handleAnswerSelect(question.id, index)}
                    className="form-check-input"
                  />
                  <label htmlFor={`option-${index}`} className="form-check-label">
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between bg-light">
          <Button
            variant="outline-secondary"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            ← Câu trước
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedAnswers).length === 0}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang nộp bài...
                </>
              ) : (
                '✅ Nộp bài'
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Câu tiếp →
            </Button>
          )}
        </Card.Footer>
      </Card>

      {/* Answer Summary */}
      <Card className="mt-3">
        <Card.Body>
          <h6>Trạng thái trả lời:</h6>
          <div className="d-flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={selectedAnswers[questions[index].id] !== undefined ? "success" : "outline-secondary"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className={currentQuestion === index ? "border-primary border-2" : ""}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestStart;
