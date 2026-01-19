import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Debug log
    console.log('ProtectedRoute Debug:', {
        isAuthenticated,
        loading,
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.log('Access denied - showing login modal');
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                    <h3>Cần đăng nhập để tiếp tục</h3>
                    <p>Vui lòng đăng nhập để sử dụng tính năng này.</p>
                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={() => window.location.href = '/login'}
                            style={{
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '5px',
                                marginRight: '10px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            🔑 Đăng nhập
                        </button>
                        <button
                            onClick={() => window.location.href = '/signup'}
                            style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            📝 Đăng ký
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    console.log('Access granted - rendering component');
    return children;
};

export default ProtectedRoute;