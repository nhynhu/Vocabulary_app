import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Tính năng này chưa được hỗ trợ trong backend hiện tại
        setError('Chức năng đặt lại mật khẩu đang được phát triển. Vui lòng liên hệ quản trị viên.');
    };

    return (
        <div className="signup-page">
            <div className="login-container">
                <div className="auth-card">
                    <h2 className="text-center mb-4">Reset Password</h2>
                    {done ? (
                        <div className="alert alert-success">
                            Password reset successful! Redirecting to login...
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {error && <div className="alert alert-warning">{error}</div>}
                            <button type="submit" className="btn btn-auth" style={{ marginTop: 10 }}>
                                Reset Password
                            </button>
                            <button
                                type="button"
                                className="btn btn-link mt-3"
                                onClick={() => navigate('/login')}
                            >
                                ← Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;