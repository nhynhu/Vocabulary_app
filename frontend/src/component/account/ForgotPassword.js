import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
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
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {sent ? (
                        <div className="alert alert-success">
                            Please check your email for the password reset link.
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-warning">{error}</div>}
                            <button type="submit" className="btn btn-auth" style={{ marginTop: 10 }}>
                                Send Reset Link
                            </button>
                            <button
                                type="button"
                                className="btn btn-link mt-3"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;