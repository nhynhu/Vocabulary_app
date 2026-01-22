import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner, ProgressBar, Modal } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Flashcard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const topicId = searchParams.get('topicId');
  const wordId = searchParams.get('wordId');

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topicInfo, setTopicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const [isFirstTimeComplete, setIsFirstTimeComplete] = useState(false);

  useEffect(() => {
    if (!topicId) {
      setError('Không tìm thấy chủ đề');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error

        // Lấy từ vựng theo topic
        const wordsData = await ApiService.getVocabularyByTopic(topicId);
        console.log('Flashcard words data:', wordsData);
        
        if (!wordsData || wordsData.length === 0) {
          setError('Chủ đề này chưa có từ vựng');
          setLoading(false);
          return;
        }
        
        setWords(wordsData);
        setTopicInfo({ id: topicId, name: `Chủ đề ${topicId}` });

        // Lấy tiến trình học nếu user đã đăng nhập
        if (user) {
          try {
            const progressData = await ApiService.getTopicProgress(topicId);
            console.log('Progress data:', progressData);
            setProgress(progressData);
            
            // Nếu có wordId, ưu tiên set theo wordId
            // Ngược lại, set theo tiến trình học
            if (wordId) {
              const idx = wordsData.findIndex(w => String(w.vocabId) === String(wordId));
              if (idx >= 0) setCurrentIndex(idx);
            } else if (!progressData.isCompleted && progressData.currentWordIndex > 0) {
              // Chỉ set tiến trình nếu chưa hoàn thành lần đầu
              // Validate index không vượt quá số từ hiện có
              const validIndex = Math.min(progressData.currentWordIndex, wordsData.length - 1);
              setCurrentIndex(Math.max(0, validIndex));
            }
          } catch (err) {
            console.error('Could not fetch progress:', err);
            // Không set error, chỉ log - vẫn cho phép học flashcard
          }
        } else if (wordId) {
          // Guest mode với wordId
          const idx = wordsData.findIndex(w => String(w.vocabId) === String(wordId));
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
  }, [topicId, wordId, user]);

  const handleNext = () => {
    setFlipped(false);
    const nextIndex = currentIndex < words.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    
    // Cập nhật tiến trình nếu user đã đăng nhập và chưa hoàn thành lần đầu
    if (user && progress && !progress.isCompleted && nextIndex > currentIndex) {
      updateProgress(nextIndex);
    }
  };

  const handlePrevious = () => {
    setFlipped(false);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : words.length - 1;
    setCurrentIndex(prevIndex);
  };
  
  // Hàm cập nhật tiến trình
  const updateProgress = async (newIndex) => {
    if (!user || !topicId) return;
    
    try {
      await ApiService.updateTopicProgress(topicId, {
        currentWordIndex: newIndex,
        totalWords: words.length
      });
      
      // Nếu đã học xong tất cả từ (đến từ cuối cùng)
      if (newIndex === words.length - 1) {
        setIsFirstTimeComplete(true);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };
  
  // Hàm hoàn thành học lần đầu
  const handleCompleteFirstTime = async () => {
    if (!user || !topicId) return;
    
    try {
      await ApiService.updateTopicProgress(topicId, {
        currentWordIndex: words.length - 1,
        totalWords: words.length
      });
      
      // Reload progress để cập nhật isCompleted
      const updatedProgress = await ApiService.getTopicProgress(topicId);
      setProgress(updatedProgress);
      setIsFirstTimeComplete(false);
      
      alert('🎉 Chúc mừng! Bạn đã hoàn thành bài học lần đầu. Giờ bạn có thể xem danh sách từ vựng.');
    } catch (err) {
      console.error('Error completing lesson:', err);
      alert('Có lỗi khi hoàn thành bài học');
    }
  };

  // Phát âm thanh
  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.log('Audio play error:', err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-4 text-gray-600">Đang tải flashcard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="danger" className="text-center max-w-md">
          <Alert.Heading>Lỗi</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={() => navigate('/topics')}>
            Quay về chủ đề
          </Button>
        </Alert>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="info" className="text-center max-w-md">
          <h5>Chưa có từ vựng</h5>
          <p>Chủ đề này chưa có từ vựng nào để luyện tập.</p>
          <Button variant="primary" onClick={() => navigate('/topics')}>
            Chọn chủ đề khác
          </Button>
        </Alert>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  
  // Safety check: nếu currentWord undefined, return loading
  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }
  
  const currentProgress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary">
              Flashcard: {topicInfo?.name || 'Chủ đề'}
            </h2>
            <p className="text-gray-500">
              Thẻ {currentIndex + 1} / {words.length}
              {user && progress && !progress.isCompleted && (
                <span className="text-warning ms-2">🔄 Học lần đầu</span>
              )}
            </p>
          </div>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            {/* Chỉ hiện nút "Xem danh sách từ" nếu đã hoàn thành lần đầu */}
            {user && progress?.isCompleted && (
              <Button 
                size="lg"
                onClick={() => navigate(`/lessons?topicId=${topicId}`)}
                className="rounded-3 px-4 py-2 fw-semibold"
                style={{ 
                  backgroundColor: '#2563eb',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                 Xem danh sách từ
              </Button>
            )}
            <Button 
              size="lg"
              onClick={() => navigate('/topics')}
              className="rounded-3 px-4 py-2 fw-semibold"
              style={{
                backgroundColor: 'white',
                border: '2px solid #dee2e6',
                color: '#495057',
                fontSize: '16px'
              }}
            >
              Chọn chủ đề khác
            </Button>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar 
          now={currentProgress} 
          label={`${Math.round(currentProgress)}%`} 
          className="mb-6 h-3 rounded-full" 
          style={{ backgroundColor: '#e2e8f0' }}
          variant="primary"
        />

        {/* Flashcard - Flip Animation */}
        <div className="flex justify-center mb-8">
          <div 
            className="relative w-full cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => setFlipped(!flipped)}
          >
            <div 
              className="relative transition-transform duration-500"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                minHeight: '380px'
              }}
            >
              {/* Mặt trước: Hình + Từ + Phát âm + Câu ví dụ */}
              <div 
                className="absolute w-full h-full rounded-2xl shadow-xl overflow-hidden bg-white"
                style={{ backfaceVisibility: 'hidden', minHeight: '380px' }}
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Bên trái - Hình ảnh */}
                  <div 
                    className="md:w-2/5 flex items-center justify-center p-6"
                    style={{ backgroundColor: '#f0f4f8', minHeight: '200px' }}
                  >
                    {(currentWord?.imageURL || currentWord?.imageUrl || currentWord?.imgURL) ? (
                      <img 
                        src={(currentWord.imageURL || currentWord.imageUrl || currentWord.imgURL).startsWith('http') 
                          ? (currentWord.imageURL || currentWord.imageUrl || currentWord.imgURL) 
                          : `${API_BASE_URL}${currentWord.imageURL || currentWord.imageUrl || currentWord.imgURL}`}
                        alt={currentWord.word || 'Word'}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '250px', 
                          objectFit: 'contain', 
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                      />
                    ) : (
                      <div 
                        className="flex items-center justify-center text-gray-400"
                        style={{ width: '200px', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '12px' }}
                      >
                        📷 No Image
                      </div>
                    )}
                  </div>

                  {/* Bên phải - Từ vựng + Phát âm + Câu ví dụ */}
                  <div className="md:w-3/5 p-6 flex flex-col justify-center">
                    <span className="text-sm text-gray-400 mb-1">Tiếng Anh</span>
                    
                    {/* Từ vựng */}
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                      {currentWord?.word || ''}
                    </h1>
                    
                    {/* Phiên âm */}
                    {currentWord?.ipa && (
                      <p className="text-lg text-gray-500 mb-3">{currentWord.ipa}</p>
                    )}
                    
                    {/* Nút phát âm */}
                    {(currentWord?.audioURL || currentWord?.audioUrl) && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="mb-4 w-fit"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          playAudio(currentWord.audioURL || currentWord.audioUrl); 
                        }}
                        title="Nghe phát âm"
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        🔊 Nghe phát âm
                      </Button>
                    )}
                    
                    {/* Câu ví dụ */}
                    {currentWord?.exampleSentence && (
                      <div className="mt-2 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-400 mb-1">Câu ví dụ:</p>
                        <p className="text-lg italic text-gray-700">
                          "{currentWord.exampleSentence}"
                        </p>
                      </div>
                    )}
                    
                    <p className="text-gray-400 text-sm mt-4">💡 Nhấn để lật thẻ</p>
                  </div>
                </div>
              </div>

              {/* Mặt sau: Nghĩa + Dịch câu ví dụ */}
              <div 
                className="absolute w-full h-full rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: '#ffffff',
                  minHeight: '380px'
                }}
              >
                <span className="text-sm text-gray-500 mb-3">Tiếng Việt</span>
                
                {/* Nghĩa của từ */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {currentWord?.meaning || ''}
                </h1>
                
                {/* Dịch câu ví dụ */}
                {currentWord?.exampleMeaning && (
                  <div className="mt-4 pt-4 border-t border-gray-200 w-full max-w-lg">
                    <p className="text-sm text-gray-500 mb-2">Dịch câu ví dụ:</p>
                    <p className="text-xl text-gray-700 italic">
                      "{currentWord.exampleMeaning}"
                    </p>
                  </div>
                )}
                
                <p className="text-gray-400 text-sm mt-6">💡 Nhấn để lật thẻ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline-secondary"
            onClick={handlePrevious}
            size="lg"
            className="px-6 py-3 rounded-xl font-semibold"
          >
            ← Thẻ trước
          </Button>

          {/* Nút phát âm riêng */}
          {(currentWord?.audioURL || currentWord?.audioUrl) && (
            <Button
              onClick={() => playAudio(currentWord.audioURL || currentWord.audioUrl)}
              size="lg"
              className="px-4 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: '#123C69', border: 'none', color: 'white' }}
              title="Nghe phát âm"
            >
              🔊
            </Button>
          )}

          <Button
            variant="outline-secondary"
            onClick={handleNext}
            size="lg"
            className="px-6 py-3 rounded-xl font-semibold"
          >
            Thẻ tiếp →
          </Button>
        </div>

        {/* Nút hoàn thành học lần đầu */}
        <Modal 
          show={user && isFirstTimeComplete && !progress?.isCompleted} 
          onHide={() => setIsFirstTimeComplete(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          </Modal.Header>
          <Modal.Body className="text-center py-5">
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h2 className="mb-3" style={{ color: '#28a745', fontWeight: 'bold' }}>Xuất sắc!</h2>
            <p className="mb-4" style={{ fontSize: '18px', color: '#6c757d' }}>
              Bạn đã xem hết tất cả các flashcard.<br />
              Hãy hoàn thành bài học để mở khóa danh sách từ vựng!
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleCompleteFirstTime}
                className="px-5 py-3 fw-bold"
                style={{ fontSize: '16px' }}
              >
                ✓ Hoàn thành bài học
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg" 
                onClick={() => setIsFirstTimeComplete(false)}
                className="px-5 py-3"
              >
                Để sau
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Flashcard;
