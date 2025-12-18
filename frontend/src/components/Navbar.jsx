import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                <Link to="/" className="text-2xl font-black tracking-tighter text-teal-500">
                    ENGLISH.APP
                </Link>

                <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
                    <Link to="/" className="hover:text-teal-500 transition-colors">TRANG CHỦ</Link>
                    <Link to="/courses" className="hover:text-teal-500 transition-colors">KHÓA HỌC</Link>
                    <Link to="/tests" className="hover:text-teal-500 transition-colors">BÀI TEST</Link>
                    {user?.role === 'admin' && (
                        <div className="flex gap-4 border-l pl-4 border-gray-200">
                            <Link to="/admin/courses" className="text-teal-600 hover:opacity-70">QUẢN LÝ KHÓA HỌC</Link>
                            <Link to="/admin/tests" className="text-teal-600 hover:opacity-70">QUẢN LÝ BÀI TEST</Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 relative">
                    {user ? (
                        // --- ĐÃ ĐĂNG NHẬP ---
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Hi,</span>
                                    <span className="block text-sm font-bold text-gray-900">{user.fullName}</span>
                                </div>
                                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-100">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                </div>
                            </button>

                            {/* DROPDOWN MENU */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-down">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 font-bold">
                                        Hồ sơ cá nhân
                                    </Link>

                                    {/* Chỉ hiện nếu là ADMIN */}
                                    {user.role === 'admin' && (
                                        <Link to="/admin/courses" className="block px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 font-bold">
                                            Trang Admin
                                        </Link>
                                    )}

                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // --- CHƯA ĐĂNG NHẬP ---
                        <>
                            <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors px-4 py-2">
                                ĐĂNG NHẬP
                            </Link>
                            <Link to="/register" className="text-sm font-bold bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition-all shadow-lg shadow-teal-100">
                                ĐĂNG KÝ
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}