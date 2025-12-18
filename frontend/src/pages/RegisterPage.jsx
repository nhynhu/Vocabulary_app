import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext'; // 1. Import thêm Context

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth(); // 2. Lấy hàm login từ Context

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Reset lỗi cũ

        try {
            // 3. Gọi API Đăng ký (Gửi lên Server)
            await registerUser(fullName, email, password);

            // 4. Tự động Đăng nhập luôn bằng Context
            // Hàm này sẽ tự lấy Token, lưu LocalStorage và cập nhật Navbar
            await login(email, password);

            alert("Đăng ký thành công! Chào mừng " + fullName);
            navigate('/'); // Chuyển về trang chủ ngay lập tức

        } catch (err) {
            // Xử lý lỗi (ví dụ: Email đã tồn tại)
            setError(err.response?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-md">
                {/* HEADER */}
                <div className="mb-12">
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">JOIN US</h1>
                    <p className="text-teal-500 font-bold text-lg">Bắt đầu hành trình chinh phục tiếng Anh.</p>
                </div>

                {error && (
                    <div className="mb-6 text-sm font-bold text-red-500 bg-red-50 p-4 border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleRegister} className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-teal-500 transition-colors">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full pb-3 border-b-2 border-gray-100 text-xl font-bold text-gray-900 focus:outline-none focus:border-teal-500 transition-colors placeholder-gray-200"
                            placeholder="Your Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-teal-500 text-white font-bold tracking-widest hover:bg-teal-600 transition-colors duration-300 uppercase shadow-lg shadow-teal-100">
                            Tạo tài khoản
                        </button>
                    </div>
                </form>

                {/* FOOTER LINK */}
                <div className="mt-12 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-500 font-medium">
                        Đã là thành viên?{' '}
                        <Link to="/login" className="text-black font-bold hover:text-teal-500 transition-colors underline decoration-2 underline-offset-4">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}