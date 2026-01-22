import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Spinner, ProgressBar, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const TestStart = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const testId = searchParams.get('testId');

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [questionResults, setQuestionResults] = useState({});
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    console.log('TestStart - testId from URL:', testId, 'type:', typeof testId);
    if (!testId || testId === 'null' || testId === 'undefined') {
      setError('Không tìm thấy bài test. Vui lòng chọn bài test từ danh sách.');
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching test with ID:', testId);
        const data = await ApiService.getTestById(testId);
        if (!data || !data.questions) {
          setError('Bài test không có câu hỏi');
          setLoading(false);
          return;
        }
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
    if (questions.length === 0) return;
    
    // Giới hạn thời gian 2 phút (120 giây)
    const TIME_LIMIT = 120;
    
    // Bắt đầu đếm thời gian khi vào bài test
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        const newTime = prev + 1;
        // Tự động nộp bài khi hết giờ
        if (newTime >= TIME_LIMIT && !showResults) {
          clearInterval(timerRef.current);
          handleSubmit();
          return TIME_LIMIT;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (showResults) return; // Không cho chọn khi đã nộp bài
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  // Toggle flag cho câu hỏi
  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId);
      } else {
        newFlags.add(questionId);
      }
      return newFlags;
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      clearInterval(timerRef.current); // Dừng đồng hồ
      
      // Tính số câu đúng và lưu kết quả từng câu
      let correctCount = 0;
      const results = {};
      
      console.log('=== DEBUG SUBMIT ===');
      console.log('Total questions:', questions.length);
      console.log('Selected answers:', selectedAnswers);
      
      questions.forEach(q => {
        const userAnswerIndex = selectedAnswers[q.questionId];
        const options = Array.isArray(q.answers) ? q.answers : JSON.parse(q.answers || '[]');
        const userAnswer = userAnswerIndex !== undefined ? options[userAnswerIndex] : null;
        const isCorrect = userAnswer === q.correctAnswer;
        
        console.log(`Question ${q.questionId}:`, {
          userAnswerIndex,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect
        });
        
        if (isCorrect) {
          correctCount++;
        }
        
        results[q.questionId] = {
          userAnswerIndex,
          userAnswer,
          correctAnswer: q.correctAnswer,
          correctAnswerIndex: options.indexOf(q.correctAnswer),
          isCorrect
        };
      });
      
      setQuestionResults(results);
      
      // Tính điểm phần trăm
      const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      
      console.log('Correct count:', correctCount);
      console.log('Percentage:', percentage);
      
      // Chuẩn hóa answers theo format backend yêu cầu
      const answersArray = questions.map(q => {
        const userAnswerIndex = selectedAnswers[q.questionId];
        const options = Array.isArray(q.answers) ? q.answers : JSON.parse(q.answers || '[]');
        return {
          questionId: q.questionId,
          userAnswer: userAnswerIndex !== undefined ? options[userAnswerIndex] : null
        };
      });
      
      console.log('Answers to submit:', answersArray);
      
      // Gửi lên backend (nếu đã đăng nhập)
      try {
        await ApiService.submitTest({
          testId: parseInt(testId),
          answers: answersArray,
          flaggedQuestions: Array.from(flaggedQuestions)
        });
      } catch (submitError) {
        console.log('Submit to backend failed (guest mode):', submitError);
      }
      
      // Hiển thị kết quả
      setResult({
        score: correctCount,
        totalQuestions: questions.length,
        percentage: percentage
      });
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      setError('Không thể nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Màu chủ đạo đồng bộ với trang Flashcard
  const primaryColor = '#123C69';
  const lightBg = 'linear-gradient(135deg, #e8f4fc 0%, #d6e6f2 100%)';

  if (loading) {
    return (
      <div className="min-h-screen py-5" style={{ background: lightBg }}>
        <Container>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <Spinner animation="border" style={{ width: '3rem', height: '3rem', color: primaryColor }} />
              <p className="mt-3" style={{ color: '#666' }}>Đang tải câu hỏi...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-5" style={{ background: lightBg }}>
        <Container>
          <Alert variant="danger" className="text-center shadow-sm rounded-3">
            <Alert.Heading>⚠️ Lỗi</Alert.Heading>
            <p>{error}</p>
            <Button 
              style={{ backgroundColor: primaryColor, border: 'none' }}
              onClick={() => navigate('/test')}
            >
              Quay về danh sách test
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (result) {
    const passed = result.percentage >= 70;
    return (
      <div className="min-h-screen py-4" style={{ background: lightBg }}>
        <Container>
          {/* Header kết quả */}
          <Card className="text-center shadow-lg mb-4 border-0 rounded-3">
            <Card.Body className="p-4">
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                {passed ? '🎉' : '😅'}
              </div>
              <h2 style={{ color: primaryColor }}>{passed ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}</h2>

              <div className="my-3">
                <h3 className={passed ? 'text-success' : 'text-warning'}>
                  {result.score}/{result.totalQuestions} câu đúng
                </h3>
                <h4 className={passed ? 'text-success' : 'text-warning'}>
                  Điểm: {result.percentage}%
                </h4>
                <p className="text-muted">
                  Thời gian làm bài: {Math.floor(seconds / 60)} phút {seconds % 60} giây / 2 phút
                </p>
              </div>

              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button 
                  style={{ backgroundColor: primaryColor, border: 'none' }}
                  onClick={() => navigate('/test')}
                >
                  Làm bài test khác
                </Button>
                <Button variant="success" onClick={() => navigate('/topics')}>
                  📚 Học từ vựng
                </Button>
                <Button 
                  variant="outline-secondary"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                  onClick={() => window.location.reload()}
                >
                  🔄 Làm lại bài này
                </Button>
              </div>
            </Card.Body>
          </Card>


        {/* Chi tiết câu hỏi hiện tại */}
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Header style={{ backgroundColor: primaryColor }} className="text-white d-flex justify-content-between align-items-center rounded-top">
              <h5 className="mb-0">Câu {currentQuestion + 1}/{questions.length}</h5>
              {flaggedQuestions.has(questions[currentQuestion]?.questionId) && (
                <Badge bg="warning" text="dark">🚩 Đã gắn cờ</Badge>
              )}
            </Card.Header>
          <Card.Body className="p-4">
            {(() => {
              const question = questions[currentQuestion];
              const options = Array.isArray(question?.answers) ? question.answers : JSON.parse(question?.answers || '[]');
              const qResult = questionResults[question?.questionId];
              
              return (
                <>
                  {/* Hiển thị hình ảnh nếu có */}
                  {question?.imageUrl && (
                    <div className="text-center mb-4">
                      <img 
                        src={question.imageUrl.startsWith('http') ? question.imageUrl : `${API_BASE_URL}${question.imageUrl}`}
                        alt="Question"
                        style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <h4 className="mb-4">{question?.content}</h4>

                  {/* Hiển thị kết quả câu hỏi */}
                  {qResult && (
                    <Alert variant={qResult.isCorrect ? 'success' : 'danger'} className="mb-3">
                      {qResult.isCorrect ? (
                        <><strong>✓ Chính xác!</strong> Bạn đã trả lời đúng.</>
                      ) : (
                        <>
                          <strong>✗ Sai!</strong>
                          {qResult.userAnswer ? (
                            <> Bạn chọn: <strong>{qResult.userAnswer}</strong></>
                          ) : (
                            <> Bạn chưa trả lời câu này.</>
                          )}
                          <br />
                          <span className="text-success">
                            <strong>→ Đáp án đúng: {qResult.correctAnswer}</strong>
                          </span>
                        </>
                      )}
                    </Alert>
                  )}

                  <div className="mt-3">
                    {options?.map((option, index) => {
                      let borderClass = 'border-secondary';
                      let bgClass = '';
                      
                      if (qResult) {
                        if (index === qResult.correctAnswerIndex) {
                          borderClass = 'border-success';
                          bgClass = 'bg-success bg-opacity-10';
                        } else if (index === qResult.userAnswerIndex && !qResult.isCorrect) {
                          borderClass = 'border-danger';
                          bgClass = 'bg-danger bg-opacity-10';
                        }
                      }
                      
                      return (
                        <div 
                          key={index} 
                          className={`mb-3 p-3 rounded border-2 ${borderClass} ${bgClass}`}
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-3">
                              {qResult && index === qResult.correctAnswerIndex && (
                                <span className="text-success fw-bold">✓</span>
                              )}
                              {qResult && index === qResult.userAnswerIndex && !qResult.isCorrect && (
                                <span className="text-danger fw-bold">✗</span>
                              )}
                            </span>
                            <span>
                              <strong className="me-2">{String.fromCharCode(65 + index)}.</strong> {option}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </Card.Body>
            <Card.Footer className="d-flex justify-content-between py-3" style={{ backgroundColor: '#f8fafc' }}>
              <Button
                variant="outline-secondary"
                style={{ borderColor: primaryColor, color: primaryColor }}
                className="px-4 py-2 rounded-pill"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                ← Câu trước
              </Button>
              <Button
                style={{ backgroundColor: primaryColor, border: 'none' }}
                className="px-4 py-2 rounded-pill"
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Câu tiếp →
              </Button>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen py-5" style={{ background: lightBg }}>
        <Container>
          <Alert variant="info" className="text-center shadow-sm rounded-3">
            <h5>Bài test trống</h5>
            <p>Bài test này chưa có câu hỏi nào.</p>
            <Button 
              style={{ backgroundColor: primaryColor, border: 'none' }}
              onClick={() => navigate('/test')}
            >
              Chọn bài test khác
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  const question = questions[currentQuestion];
  // Backend lưu answers dưới dạng JSON string hoặc mảng
  const options = Array.isArray(question?.answers) ? question.answers : JSON.parse(question?.answers || '[]');

  // Lấy thông tin cho bảng câu hỏi
  const getQuestionStatus = (q) => {
    const isFlagged = flaggedQuestions.has(q.questionId);
    const isAnswered = selectedAnswers[q.questionId] !== undefined;
    return { isFlagged, isAnswered };
  };

  return (
    <div className="min-h-screen py-4" style={{ background: lightBg }}>
      <Container>
        <Row>
          {/* Cột chính - Câu hỏi */}
          <Col lg={8}>
            {/* Header với Timer và Progress */}
            <Card className="mb-4 shadow-sm border-0 rounded-3">
              <Card.Body className="py-3">
                <Row className="align-items-center">
                  <Col>
                    <ProgressBar 
                      now={progress} 
                      label={`${currentQuestion + 1}/${questions.length}`}
                      className="rounded-pill"
                      style={{ height: '25px', backgroundColor: '#e2e8f0' }}
                    >
                      <ProgressBar now={progress} style={{ backgroundColor: primaryColor }} />
                    </ProgressBar>
                  </Col>
                  <Col xs="auto">
                    <span 
                      className="badge fs-6 px-3 py-2 rounded-pill" 
                      style={{ 
                        backgroundColor: seconds > 90 ? '#dc3545' : primaryColor,
                        animation: seconds > 90 ? 'pulse 1s infinite' : 'none'
                      }}
                    >
                      ⏰ {Math.floor((120 - seconds) / 60)}:{String((120 - seconds) % 60).padStart(2, '0')}
                    </span>
                    {seconds > 90 && (
                      <div className="small text-danger mt-1 text-end">
                        <strong>Còn {120 - seconds}s!</strong>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

          {/* Question Card */}
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header style={{ backgroundColor: primaryColor }} className="text-white d-flex justify-content-between align-items-center rounded-top">
                <h5 className="mb-0">Câu {currentQuestion + 1}/{questions.length}</h5>
                <Button 
                  variant={flaggedQuestions.has(question?.questionId) ? "warning" : "outline-light"}
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => toggleFlag(question?.questionId)}
                  title={flaggedQuestions.has(question?.questionId) ? "Bỏ gắn cờ" : "Gắn cờ câu hỏi này"}
                >
                  🚩 {flaggedQuestions.has(question?.questionId) ? "Đã gắn cờ" : "Gắn cờ"}
                </Button>
              </Card.Header>
            <Card.Body className="p-4">
              {/* Hiển thị hình ảnh nếu có */}
              {question?.imageUrl && (
                <div className="text-center mb-4">
                  <img 
                    src={question.imageUrl.startsWith('http') ? question.imageUrl : `${API_BASE_URL}${question.imageUrl}`}
                    alt="Question"
                    style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <h4 className="mb-4">{question?.content}</h4>

              <div className="mt-3">
                {options?.map((option, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 p-3 rounded-3 border-2 ${
                      selectedAnswers[question.questionId] === index 
                        ? '' 
                        : 'border-secondary'
                    }`}
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      backgroundColor: selectedAnswers[question.questionId] === index ? 'rgba(18, 60, 105, 0.1)' : 'white',
                      borderColor: selectedAnswers[question.questionId] === index ? primaryColor : '#dee2e6'
                    }}
                    onClick={() => handleAnswerSelect(question.questionId, index)}
                  >
                    <div className="form-check mb-0">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name={`question-${question.questionId}`}
                        value={index}
                        checked={selectedAnswers[question.questionId] === index}
                        onChange={() => handleAnswerSelect(question.questionId, index)}
                        className="form-check-input"
                        style={{ borderColor: primaryColor }}
                      />
                      <label htmlFor={`option-${index}`} className="form-check-label w-100" style={{ cursor: 'pointer' }}>
                        <strong className="me-2" style={{ color: primaryColor }}>{String.fromCharCode(65 + index)}.</strong> {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between py-3" style={{ backgroundColor: '#f8fafc' }}>
              <Button
                variant="outline-secondary"
                className="px-4 py-2 rounded-pill"
                style={{ borderColor: primaryColor, color: primaryColor }}
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                ← Câu trước
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  size="lg"
                  className="px-4 rounded-pill"
                  style={{ backgroundColor: Object.keys(selectedAnswers).length < questions.length ? '#ccc' : '#28a745', border: 'none' }}
                  onClick={handleSubmit}
                  disabled={submitting || Object.keys(selectedAnswers).length < questions.length}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang nộp bài...
                    </>
                  ) : (
                    Object.keys(selectedAnswers).length < questions.length 
                      ? `Còn ${questions.length - Object.keys(selectedAnswers).length} câu chưa làm`
                      : '✓ Nộp bài'
                  )}
                </Button>
              ) : (
                <Button
                  className="px-4 py-2 rounded-pill"
                  style={{ backgroundColor: primaryColor, border: 'none' }}
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Câu tiếp →
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>

        {/* Cột bên phải - Bảng câu hỏi */}
        <Col lg={4}>
          {/* Bảng điều hướng câu hỏi */}
          <Card className="shadow-sm mb-3 sticky-top border-0 rounded-3" style={{ top: '80px' }}>
            <Card.Header style={{ backgroundColor: primaryColor }} className="text-white rounded-top">
              <h6 className="mb-0">📋 Bảng câu hỏi</h6>
            </Card.Header>
            <Card.Body>
              {/* Chú thích */}
              <div className="mb-3 small">
                <Badge bg="success" className="me-1">✓</Badge> Đã trả lời
                <Badge bg="outline-secondary" className="ms-2 me-1 border">○</Badge> Chưa trả lời
                <br />
                <span className="me-1">🚩</span> Đã gắn cờ
              </div>
              
              {/* Grid câu hỏi */}
              <div className="d-flex flex-wrap gap-2">
                {questions.map((q, index) => {
                  const { isFlagged, isAnswered } = getQuestionStatus(q);
                  return (
                    <OverlayTrigger
                      key={index}
                      placement="top"
                      overlay={
                        <Tooltip>
                          Câu {index + 1}
                          {isAnswered && ' - Đã trả lời'}
                          {isFlagged && ' - Đã gắn cờ'}
                        </Tooltip>
                      }
                    >
                      <Button
                        size="sm"
                        onClick={() => setCurrentQuestion(index)}
                        className={`position-relative rounded-2 ${currentQuestion === index ? 'border-3' : ''}`}
                        style={{ 
                          minWidth: '40px', 
                          minHeight: '38px',
                          backgroundColor: isAnswered ? primaryColor : 'white',
                          color: isAnswered ? 'white' : primaryColor,
                          border: isAnswered ? 'none' : `1px solid ${primaryColor}`,
                          borderColor: currentQuestion === index ? '#ffc107' : undefined
                        }}
                      >
                        {index + 1}
                        {isFlagged && (
                          <span 
                            className="position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: '10px' }}
                          >
                            🚩
                          </span>
                        )}
                      </Button>
                    </OverlayTrigger>
                  );
                })}
              </div>

              {/* Thống kê */}
              <hr />
              <div className="small text-muted">
                <div className="d-flex justify-content-between mb-1">
                  <span>Đã trả lời:</span>
                  <strong>{Object.keys(selectedAnswers).length}/{questions.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Đã gắn cờ:</span>
                  <strong>{flaggedQuestions.size}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Chưa trả lời:</span>
                  <strong>{questions.length - Object.keys(selectedAnswers).length}</strong>
                </div>
              </div>

              {/* Nút lọc */}
              <hr />
              <div className="d-flex flex-wrap gap-2">
                {flaggedQuestions.size > 0 && (
                  <Button 
                    variant="warning" 
                    size="sm"
                    className="rounded-pill"
                    onClick={() => {
                      const flaggedIndex = questions.findIndex(q => flaggedQuestions.has(q.questionId));
                      if (flaggedIndex !== -1) setCurrentQuestion(flaggedIndex);
                    }}
                  >
                    🚩 Xem câu gắn cờ
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Nút nộp bài */}
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="text-center">
              <Button
                size="lg"
                className="w-100 rounded-pill py-3"
                style={{ backgroundColor: Object.keys(selectedAnswers).length < questions.length ? '#ccc' : primaryColor, border: 'none' }}
                onClick={handleSubmit}
                disabled={submitting || Object.keys(selectedAnswers).length < questions.length}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang nộp bài...
                  </>
                ) : (
                  Object.keys(selectedAnswers).length < questions.length 
                    ? `Còn ${questions.length - Object.keys(selectedAnswers).length} câu chưa làm`
                    : '✓ Nộp bài kiểm tra'
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default TestStart;
