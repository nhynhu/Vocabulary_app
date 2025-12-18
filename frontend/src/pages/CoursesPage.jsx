import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CoursesPage() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/content/topics')
            .then(res => {
                setTopics(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleTopicClick = (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            if (window.confirm("Bạn cần đăng nhập để vào học. Đến trang đăng nhập ngay?")) {
                navigate('/login');
            }
        } else {
            navigate(`/topic/${id}/learn`);
        }
    };

    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-black text-teal-500 mb-16 tracking-tight">KHO TÀNG TỪ VỰNG</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topics.map((topic, index) => (
                        <div
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.id)}
                            className="group cursor-pointer hover-lift"
                        >
                            {/* Hình ảnh vuông vức */}
                            <div className="h-64 bg-gray-100 overflow-hidden relative">
                                {/* Số thứ tự đè lên ảnh một chút */}
                                <div className="absolute top-4 left-4 text-4xl font-black text-white drop-shadow-md z-10">
                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                </div>
                                <img
                                    src={topic.image || "https://img.freepik.com/free-vector/english-book-illustration_1284-42352.jpg"}
                                    alt={topic.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Lớp phủ màu Teal khi hover */}
                                <div className="absolute inset-0 bg-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>

                            {/* Nội dung bên dưới */}
                            <div className="pt-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {topic.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {topic.description}
                                </p>
                                <div className="w-full h-1 bg-gray-100 group-hover:bg-teal-400 transition-colors duration-300"></div>
                                <div className="mt-3 text-sm font-bold text-gray-400 group-hover:text-teal-500 transition-colors uppercase tracking-wider">
                                    Bắt đầu học
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}