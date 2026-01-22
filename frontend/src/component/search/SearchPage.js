import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Cache data for client-side search
  const [allTopics, setAllTopics] = useState([]);
  const [allVocabulary, setAllVocabulary] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load all data on mount for client-side search
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const topics = await ApiService.getAllTopics();
        setAllTopics(topics);

        // Load vocabulary for each topic
        const vocabPromises = topics.map(topic =>
          ApiService.getVocabularyByTopic(topic.topicId).then(vocabs =>
            vocabs.map(v => ({ ...v, topicName: topic.name, topicId: topic.topicId }))
          ).catch(() => [])
        );
        const vocabResults = await Promise.all(vocabPromises);
        setAllVocabulary(vocabResults.flat());
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    loadAllData();
  }, []);

  // Auto search on mount if query exists and data is loaded
  useEffect(() => {
    if (initialQuery && dataLoaded) {
      performSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, dataLoaded]);

  const performSearch = useCallback((searchQuery) => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      let searchResults = [];

      // Search in topics
      const topicResults = allTopics
        .filter(topic =>
          topic.name?.toLowerCase().includes(searchTerm)
        )
        .map(topic => ({
          ...topic,
          type: 'topic'
        }));
      searchResults = [...searchResults, ...topicResults];

      // Search in vocabulary
      const vocabResults = allVocabulary
        .filter(vocab =>
          vocab.word?.toLowerCase().includes(searchTerm) ||
          vocab.meaning?.toLowerCase().includes(searchTerm) ||
          vocab.exampleSentence?.toLowerCase().includes(searchTerm)
        )
        .map(vocab => ({
          ...vocab,
          type: 'vocabulary',
          english: vocab.word,
          vietnamese: vocab.meaning,
          topic: vocab.topicName
        }));
      searchResults = [...searchResults, ...vocabResults];

      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Không thể tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [allTopics, allVocabulary]);

  const handleResultClick = (result) => {
    if (result.type === 'topic') {
      navigate(`/lessons?topicId=${result.topicId}`);
    } else if (result.type === 'vocabulary') {
      navigate(`/flashcard?topicId=${result.topicId}&wordId=${result.vocabId}`);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '1200px' }}>
      {/* Error */}
      {error && (
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Lỗi tìm kiếm</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => setError('')}>
            Đóng
          </Button>
        </Alert>
      )}

      {/* Results */}
      {hasSearched && !loading && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ color: '#123C69', fontWeight: '600', margin: 0 }}>
              Kết quả cho "{query}"
              <Badge bg="primary" className="ms-2" style={{ fontSize: '14px', padding: '6px 12px' }}>
                {results.length}
              </Badge>
            </h5>
            {results.length > 0 && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setHasSearched(false);
                }}
                style={{ borderRadius: '8px', fontWeight: '500' }}
              >
                Xóa kết quả
              </Button>
            )}
          </div>

          <Row className="g-3">
            {results.length > 0 ? (
              results.map((result, index) => (
                <Col key={`${result.type}-${result.topicId || result.vocabId}-${index}`} lg={6} md={6} sm={12}>
                  <Card
                    className="h-100 shadow-sm"
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      border: 'none',
                      transition: 'all 0.3s',
                      borderLeft: `4px solid ${result.type === 'topic' ? '#123C69' : '#28a745'}`
                    }}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <Card.Body style={{ padding: '20px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge
                          bg={result.type === 'topic' ? 'primary' : 'success'}
                          style={{ 
                            fontSize: '12px', 
                            padding: '6px 12px',
                            borderRadius: '6px'
                          }}
                        >
                          {result.type === 'topic' ? 'CHỦ ĐỀ' : 'TỪ VỰNG'}
                        </Badge>
                        <small style={{ color: '#6c757d', fontSize: '12px' }}>Click để xem →</small>
                      </div>

                      {result.type === 'topic' ? (
                        <>
                          <Card.Title style={{ 
                            color: '#123C69', 
                            fontSize: '20px', 
                            fontWeight: '600',
                            marginBottom: '12px'
                          }}>
                            {result.name}
                          </Card.Title>
                          {result.description && (
                            <Card.Text style={{ 
                              color: '#6c757d', 
                              fontSize: '14px',
                              marginBottom: '12px',
                              lineHeight: '1.6'
                            }}>
                              {result.description}
                            </Card.Text>
                          )}
                          <div style={{ 
                            fontSize: '13px', 
                            color: '#999',
                            backgroundColor: '#f8f9fa',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            display: 'inline-block'
                          }}>
                            📚 {result.vocabularyCount || 0} từ vựng
                          </div>
                        </>
                      ) : (
                        <>
                          <Card.Title style={{ 
                            color: '#28a745', 
                            fontSize: '20px', 
                            fontWeight: '600',
                            marginBottom: '12px'
                          }}>
                            {result.word}
                            {result.ipa && (
                              <span style={{ 
                                marginLeft: '10px', 
                                color: '#17a2b8', 
                                fontSize: '14px',
                                fontStyle: 'italic',
                                fontWeight: '400'
                              }}>
                                {result.ipa}
                              </span>
                            )}
                          </Card.Title>
                          <Card.Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            <div style={{ marginBottom: '10px' }}>
                              <strong style={{ color: '#495057' }}>Nghĩa:</strong> 
                              <span style={{ color: '#6c757d', marginLeft: '6px' }}>{result.meaning}</span>
                            </div>
                            {result.exampleSentence && (
                              <div style={{ 
                                marginBottom: '10px',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: '3px solid #28a745'
                              }}>
                                <strong style={{ color: '#495057', fontSize: '13px' }}>Ví dụ:</strong>
                                <div style={{ color: '#6c757d', fontStyle: 'italic', marginTop: '4px' }}>
                                  {result.exampleSentence}
                                </div>
                              </div>
                            )}
                            <small style={{ 
                              color: '#6c757d',
                              backgroundColor: '#e9ecef',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}>
                              📖 Chủ đề: {result.topicName}
                            </small>
                          </Card.Text>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="info" className="text-center" style={{ 
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#e7f3ff',
                  color: '#004085',
                  padding: '40px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
                  <h5 style={{ fontWeight: '600', marginBottom: '16px' }}>Không tìm thấy kết quả</h5>
                  <p style={{ fontSize: '15px' }}>Không có kết quả nào cho từ khóa "<strong>{query}</strong>"</p>
                  <div className="mt-4">
                    <p style={{ marginBottom: '12px', fontWeight: '500' }}>Gợi ý:</p>
                    <ul className="list-unstyled" style={{ fontSize: '14px' }}>
                      <li style={{ marginBottom: '8px' }}>• Kiểm tra chính tả</li>
                      <li style={{ marginBottom: '8px' }}>• Thử từ khóa khác</li>
                      <li style={{ marginBottom: '8px' }}>• Sử dụng từ ngắn gọn hơn</li>
                    </ul>
                  </div>
                </Alert>
              </Col>
            )}
          </Row>
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && !loading && (
        <div className="text-center mt-5" style={{ padding: '60px 20px' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            opacity: 0.3
          }}>🔍</div>
          <h4 style={{ color: '#123C69', fontWeight: '600', marginBottom: '12px' }}>
            Nhập từ khóa để tìm kiếm
          </h4>
          <p className="text-muted" style={{ fontSize: '15px' }}>
            Tìm kiếm từ vựng và chủ đề trong hệ thống học tập
          </p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
