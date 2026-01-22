import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../common/AuthModal';
import SearchBox from '../search/SearchBox';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <Navbar expand="lg" fixed="top" className="bg-[#123C69] shadow-lg" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                            <span className="text-lg font-bold text-[#AC3B61]">V</span>
                        </div>
                        <span className="text-white font-black tracking-wider text-2xl">VOCABMAFIA</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        {/* Search Box */}
                        <div className="ms-3">
                            <SearchBox />
                        </div>
                        
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link onClick={() => navigate('/')} className="nav-link-light" style={{ fontSize: '14px' }}>Trang chủ</Nav.Link>
                            <Nav.Link onClick={() => navigate('/topics')} className="nav-link-light" style={{ fontSize: '14px' }}>Học tập</Nav.Link>
                            <Nav.Link onClick={() => navigate('/test')} className="nav-link-light" style={{ fontSize: '14px' }}>Kiểm tra</Nav.Link>
                            <Nav.Link onClick={() => navigate('/admin')} className="nav-link-light" style={{ fontSize: '14px' }}>Trang admin</Nav.Link>

                            {user && !user.isGuest ? (
                                <Dropdown align="end" className="ms-3">
                                    <Dropdown.Toggle variant="outline-light" className="rounded-pill px-4">
                                        Hello, {user.fullName || user.name || user.email}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => {navigate('/profile'); }}>Hồ sơ</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { logout(); window.location.href = '/'; }}>Đăng xuất</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Button
                                    className="ms-3 px-4 rounded-pill"
                                    variant="light"
                                    style={{ color: '#AC3B61', fontWeight: 'bold' }}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
        </>
    );
};

export default Header;