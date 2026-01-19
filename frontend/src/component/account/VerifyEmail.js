import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        // Tính năng xác minh email chưa được hỗ trợ trong backend hiện tại
        setStatus('info');
    }, [token]);

    return (
        <div className="signup-page">
            <div className="login-container">
                <div className="auth-card">
                    <h2 className="text-center mb-4">Email Verification</h2>
                    <div className="alert alert-info">
                        Chức năng xác minh email đang được phát triển.
                        <br />
                        Bạn có thể đăng nhập ngay với tài khoản đã đăng ký.
                    </div>
                    <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={() => navigate('/login')}
                    >
                        Đi đến Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;