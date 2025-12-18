import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TestsPage() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = "http://localhost:3000/content";

    useEffect(() => {
        // Lấy danh sách chủ đề kèm theo các bài test bên trong
        const fetchContent = async () => {
            try {
                const res = await axios.get(`${API_URL}/topics`);
                // Chúng ta cần lấy thêm thông tin bài test cho mỗi topic
                const topicsWithTests = await Promise.all(res.data.map(async (topic) => {
                    const testRes = await axios.get(`${API_URL}/topics/${topic.id}/tests`);
                    return { ...topic, tests: testRes.data };
                }));
                setTopics(topicsWithTests);
            } catch (err) {
                console.error("Lỗi tải danh sách bài test:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Đang tải bài test...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tighter">BÀI KIỂM TRA</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map(topic => (
                        topic.tests && topic.tests.length > 0 ? (
                            topic.tests.map(test => (
                                <div key={test.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="mb-6">
                                        <span className="text-xs font-black text-teal-500 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
                                            {topic.name}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bài Test #{test.id}</h3>
                                    <p className="text-gray-400 font-medium mb-8">
                                        Kiểm tra kiến thức về từ vựng chủ đề {topic.name}.
                                    </p>
                                    <Link
                                        to={`/test/${test.id}`}
                                        className="block text-center py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-teal-500 transition-colors shadow-lg shadow-gray-200 hover:shadow-teal-100"
                                    >
                                        BẮT ĐẦU LÀM BÀI
                                    </Link>
                                </div>
                            ))
                        ) : null
                    ))}
                </div>

                {topics.every(t => !t.tests || t.tests.length === 0) && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold text-xl">Hiện chưa có bài test nào được tạo.</p>
                    </div>
                )}
            </div>
        </div>
    );
}