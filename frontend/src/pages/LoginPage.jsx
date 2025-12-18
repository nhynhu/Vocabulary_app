import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);

            console.log("Dữ liệu Server trả về:", data); // <--- In ra để soi

            if (data && data.user && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/';
            } else {
                // Nếu server trả về cấu trúc lạ (ví dụ data.data.user) thì phải sửa lại code ở trên
                setError("Lỗi: Server không trả về thông tin User hợp lệ.");
            }

        } catch (err) {
            setError("Email hoặc mật khẩu không đúng.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-md">
                {/* HEADER: Chữ cực lớn */}
                <div className="mb-12">
                    <h1 className="text-6xl font-black text-teal-500 tracking-tighter mb-2">LOGIN</h1>
                    <p className="text-gray-400 font-medium text-lg">Chào mừng bạn quay lại.</p>
                </div>

                {/* ERROR MESSAGE: Text thuần, màu đỏ */}
                {error && (
                    <div className="mb-6 text-sm font-bold text-red-500 bg-red-50 p-4 border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-teal-500 transition-colors">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full pb-3 border-b-2 border-gray-100 text-xl font-bold text-gray-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-gray-200"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-teal-500 transition-colors">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full pb-3 border-b-2 border-gray-100 text-xl font-bold text-gray-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-gray-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-teal-500 text-white font-bold tracking-widest hover:bg-teal-600 transition-colors duration-300 uppercase">
                            Đăng nhập ngay
                        </button>
                    </div>
                </form>

                {/* FOOTER LINK */}
                <div className="mt-12 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-500 font-medium">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-teal-500 font-bold hover:text-black transition-colors underline decoration-2 underline-offset-4">
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}