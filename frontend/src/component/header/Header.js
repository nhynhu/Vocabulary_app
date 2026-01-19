import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../common/AuthModal';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <Navbar expand="lg" fixed="top" className="transparent-navbar" variant="dark">
                <Container>
                    {/* Logo Trắng */}
                    <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 40, height: 40, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AC3B61', fontWeight: 'bold', fontSize: '1.2rem' }}>E</div>
                        <span style={{ color: 'white', fontWeight: '800', letterSpacing: '1px', fontSize: '1.5rem' }}>ENGMASTER</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link onClick={() => navigate('/')} className="nav-link-light">Trang chủ</Nav.Link>
                            <Nav.Link onClick={() => navigate('/topics')} className="nav-link-light">Học tập</Nav.Link>
                            <Nav.Link onClick={() => navigate('/test')} className="nav-link-light">Kiểm tra</Nav.Link>

                            {user ? (
                                <Dropdown align="end" className="ms-3">
                                    <Dropdown.Toggle variant="outline-light" className="rounded-pill px-4">
                                        Hello, {user.fullName || user.name || user.email}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Button
                                    className="ms-3 px-4 rounded-pill"
                                    variant="light"
                                    style={{ color: '#AC3B61', fontWeight: 'bold' }}
                                    onClick={() => setShowAuthModal(true)}
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