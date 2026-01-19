import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
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

    // SỬA LỖI: Thay alert bằng modal
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
            const results = await ApiService.searchWords(query);
            setSearchResults(results.slice(0, 8));
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
        if (result.link) {
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
            <div style={{ position: 'relative' }}>
                <Form className="d-flex" style={{ alignItems: 'center', gap: '8px' }} onSubmit={handleSearchSubmit}>
                    <Form.Control
                        type="search"
                        placeholder={user ? "Search" : "Đăng nhập để tìm kiếm"}
                        className="me-2"
                        aria-label="Search"
                        style={{ height: '32px', borderRadius: '20px', fontSize: '1rem', width: '250px' }}
                        value={searchQuery}
                        onChange={(e) => user && handleSearch(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleBlur}
                        disabled={!user}
                    />
                    <Button
                        type="submit"
                        style={{
                            backgroundColor: '#FFDDDD',
                            borderColor: '#FFDDDD',
                            color: '#fff',
                            height: '32px',
                            padding: '0 12px',
                            opacity: user ? 1 : 0.6
                        }}
                        disabled={!user}
                    >
                        <img src="/image/search-icon.png" alt="search" style={{ width: 20, height: 20 }} />
                    </Button>
                </Form>

                {/* Dropdown kết quả tìm kiếm */}
                {showResults && searchResults.length > 0 && user && (
                    <div className="search-dropdown">
                        {searchResults.map((result, index) => (
                            <div
                                key={index}
                                className="search-item"
                                onClick={() => handleSelectResult(result)}
                            >
                                <div className="search-item-title">
                                    {result.type === 'topic' ? result.nameVi || result.name : result.english}
                                </div>
                                <div className="search-item-subtitle">
                                    {result.type === 'topic' ? `${result.wordCount} từ vựng` : result.vietnamese}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Thông báo không có kết quả */}
                {showResults && searchResults.length === 0 && searchQuery.trim() && user && (
                    <div className="search-dropdown">
                        <div className="search-no-results">
                            Không tìm thấy kết quả cho "{searchQuery}"
                        </div>
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
