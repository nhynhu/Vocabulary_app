import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { useAuth } from '../context/AuthContext'; // Dùng Context lấy user

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // State lưu thống kê thật
    const [statsData, setStatsData] = useState({
        wordsLearned: 0,
        completedTopics: 0,
        avgScore: 0,
        streak: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // GỌI API THẬT
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Gọi qua Gateway (Cổng 3000) -> Learning Service
                const response = await axios.get('http://localhost:3000/learning/stats', {
                    headers: { Authorization: `Bearer ${token}` } // Gửi kèm token
                });
                setStatsData(response.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
            logout();
        }
    };

    if (!user) return null;

    // Cấu hình hiển thị theo dữ liệu thật
    const displayStats = [
        { label: "Words Learned", value: statsData.wordsLearned, unit: "words" },
        { label: "Topics Done", value: statsData.completedTopics, unit: "topics" },
        { label: "Avg Test Score", value: statsData.avgScore, unit: "points" },
    ];

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="mb-16 border-b-4 border-teal-500 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">
                            PROFILE.
                        </h1>
                        <p className="text-gray-400 font-bold tracking-widest uppercase">
                            Your learning journey.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors mb-2"
                    >
                        Log out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* CỘT TRÁI: THÔNG TIN USER */}
                    <div className="col-span-1">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24 shadow-sm">
                            <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-4xl font-black text-white mb-6 mx-auto shadow-xl shadow-teal-100">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
                                <p className="text-sm text-gray-400 font-medium">{user.email}</p>
                                {/* Hiện Role nếu là admin */}
                                {user.role === 'admin' && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: THỐNG KÊ REAL-TIME */}
                    <div className="col-span-1 md:col-span-2 space-y-12">

                        {/* STATS GRID */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Statistics</h3>
                            {loading ? (
                                <div className="text-gray-400 font-medium">Đang tải số liệu...</div>
                            ) : (
                                <div className="grid grid-cols-3 gap-6">
                                    {displayStats.map((stat, index) => (
                                        <div key={index} className="p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-teal-200 transition-colors">
                                            <div className="text-4xl font-black text-teal-500 mb-1">{stat.value}</div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PHẦN LEVEL (Tính dựa trên số từ) */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Current Level</h3>
                            <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl flex items-center justify-between">
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900">
                                        {statsData.wordsLearned < 50 ? "Beginner (A1)" :
                                            statsData.wordsLearned < 200 ? "Elementary (A2)" : "Intermediate (B1)"}
                                    </h4>
                                    <p className="text-gray-500 text-sm mt-1">Dựa trên số từ vựng bạn đã học.</p>
                                </div>
                                <div className="h-16 w-16 rounded-full border-4 border-teal-500 flex items-center justify-center font-black text-teal-600 text-xl">
                                    {Math.min(100, Math.round(statsData.wordsLearned / 5))}%
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}