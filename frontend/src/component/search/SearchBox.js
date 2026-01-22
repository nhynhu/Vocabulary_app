import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import AuthModal from '../common/AuthModal';

const SearchBox = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Tìm kiếm cả từ vựng và chủ đề
    const handleSearch = async (query) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const searchTerm = query.toLowerCase().trim();
            
            // Lấy tất cả chủ đề
            const topics = await ApiService.getAllTopics();
            
            // Tìm kiếm chủ đề
            const topicResults = topics
                .filter(topic => 
                    topic.name?.toLowerCase().includes(searchTerm) ||
                    topic.description?.toLowerCase().includes(searchTerm)
                )
                .slice(0, 3)
                .map(topic => ({
                    ...topic,
                    type: 'topic',
                    link: `/lessons?topicId=${topic.topicId}`
                }));

            // Lấy từ vựng từ tất cả chủ đề và tìm kiếm
            const vocabPromises = topics.map(topic =>
                ApiService.getVocabularyByTopic(topic.topicId)
                    .then(vocabs => vocabs.map(v => ({
                        ...v,
                        topicName: topic.name,
                        topicId: topic.topicId
                    })))
                    .catch(() => [])
            );
            
            const allVocabs = (await Promise.all(vocabPromises)).flat();
            
            const vocabResults = allVocabs
                .filter(vocab =>
                    vocab.word?.toLowerCase().includes(searchTerm) ||
                    vocab.meaning?.toLowerCase().includes(searchTerm)
                   // vocab.exampleSentence?.toLowerCase().includes(searchTerm)
                )
                .slice(0, 5)
                .map(vocab => ({
                    ...vocab,
                    type: 'vocabulary',
                    link: `/flashcard?topicId=${vocab.topicId}&wordId=${vocab.vocabId}`
                }));

            // Kết hợp kết quả: chủ đề trước, từ vựng sau
            const combinedResults = [...topicResults, ...vocabResults].slice(0, 8);
            
            setSearchResults(combinedResults);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowResults(false);
        }
    };

    // Thêm hàm điều hướng khi click
    const handleSelectResult = (result) => {
        setShowResults(false);
        setSearchQuery('');
        
        if (result.type === 'topic') {
            navigate(`/lessons?topicId=${result.topicId}`);
        } else if (result.type === 'vocabulary') {
            navigate(`/flashcard?topicId=${result.topicId}&wordId=${result.vocabId}`);
        } else if (result.link) {
            navigate(result.link);
        }
    };

    const handleInputFocus = () => {
        if (!user) {
            setShowAuthModal(true);
        }
    };

    const handleLoginFromModal = () => {
        setShowAuthModal(false);
        navigate('/login');
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 200);
    };

    return (
        <>
            <div style={{ position: 'relative', width: '320px' }}>
                <Form onSubmit={handleSearchSubmit}>
                    <div style={{ position: 'relative' }}>
                        <Form.Control
                            type="search"
                            placeholder={user ? "Tìm kiếm từ vựng, chủ đề..." : "Đăng nhập để tìm kiếm"}
                            aria-label="Search"
                            style={{ 
                                height: '40px', 
                                borderRadius: '25px', 
                                fontSize: '14px', 
                                paddingLeft: '42px',
                                paddingRight: '15px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            value={searchQuery}
                            onChange={(e) => user && handleSearch(e.target.value)}
                            onFocus={(e) => {
                                handleInputFocus();
                                e.target.style.borderColor = '#AC3B61';
                                e.target.style.boxShadow = '0 2px 12px rgba(172,59,97,0.2)';
                            }}
                            onBlur={(e) => {
                                handleBlur();
                                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                            disabled={!user}
                        />
                        {/* Icon search bên trong */}
                        <div style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#6c757d',
                            pointerEvents: 'none'
                        }}>
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </div>
                    </div>
                </Form>

                {/* Dropdown kết quả tìm kiếm */}
                {showResults && searchResults.length > 0 && user && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        zIndex: 9999,
                        border: '1px solid #e0e0e0'
                    }}>
                        {searchResults.map((result, index) => (
                            <div
                                key={`${result.type}-${index}`}
                                onClick={() => handleSelectResult(result)}
                                style={{
                                    padding: '14px 16px',
                                    cursor: 'pointer',
                                    borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                {/* Badge loại */}
                                <div style={{ marginBottom: '6px' }}>
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: result.type === 'topic' ? '#123C69' : '#28a745',
                                        color: 'white',
                                        fontWeight: '500'
                                    }}>
                                        {result.type === 'topic' ? 'CHỦ ĐỀ' : 'TỪ VỰNG'}
                                    </span>
                                </div>

                                {result.type === 'topic' ? (
                                    <>
                                        {/* Tên chủ đề */}
                                        <div style={{ 
                                            fontWeight: '600', 
                                            color: '#123C69', 
                                            marginBottom: '4px', 
                                            fontSize: '15px' 
                                        }}>
                                            {result.name}
                                        </div>
                                        {/* Mô tả chủ đề */}
                                        {result.description && (
                                            <div style={{ 
                                                fontSize: '13px', 
                                                color: '#6c757d',
                                                marginBottom: '4px'
                                            }}>
                                                {result.description}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '12px', color: '#999' }}>
                                            {result.vocabularyCount || 0} từ vựng
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Từ vựng */}
                                        <div style={{ 
                                            fontWeight: '600', 
                                            color: '#28a745', 
                                            marginBottom: '4px', 
                                            fontSize: '15px' 
                                        }}>
                                            {result.word}
                                            {result.ipa && (
                                                <span style={{ 
                                                    marginLeft: '8px', 
                                                    color: '#17a2b8', 
                                                    fontSize: '13px',
                                                    fontStyle: 'italic',
                                                    fontWeight: '400'
                                                }}>
                                                    {result.ipa}
                                                </span>
                                            )}
                                        </div>
                                        {/* Nghĩa */}
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: '#495057',
                                            marginBottom: '4px'
                                        }}>
                                            <strong>Nghĩa:</strong> {result.meaning}
                                        </div>
                                        {/* Ví dụ */}
                                        {result.exampleSentence && (
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#6c757d',
                                                fontStyle: 'italic',
                                                marginBottom: '4px',
                                                paddingLeft: '8px',
                                                borderLeft: '2px solid #e0e0e0'
                                            }}>
                                                <strong>VD:</strong> {result.exampleSentence}
                                            </div>
                                        )}
                                        {/* Chủ đề */}
                                        <div style={{ fontSize: '11px', color: '#999' }}>
                                            📚 {result.topicName}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Thông báo không có kết quả */}
                {showResults && searchResults.length === 0 && searchQuery.trim() && user && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        padding: '20px',
                        textAlign: 'center',
                        color: '#6c757d',
                        fontSize: '14px',
                        zIndex: 9999,
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}>🔍</div>
                        Không tìm thấy kết quả cho "<strong>{searchQuery}</strong>"
                    </div>
                )}
            </div>

            {/* Auth Modal */}
            <AuthModal
                show={showAuthModal}
                onHide={() => setShowAuthModal(false)}
                onLogin={handleLoginFromModal}
                featureName="Tìm kiếm"
            />
        </>
    );
};

export default SearchBox;
