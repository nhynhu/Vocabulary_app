import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'topics';
    const { user } = useAuth();
    const API_URL = "http://localhost:3000/content";

    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [testQuestions, setTestQuestions] = useState([{ content: '', answers: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' }]);

    useEffect(() => {
        axios.get(`${API_URL}/topics`).then(res => setTopics(res.data));
    }, []);

    const addQuestionField = () => {
        setTestQuestions([...testQuestions, { content: '', answers: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' }]);
    };

    const handleSaveTest = async () => {
        if (!selectedTopic) return alert("Chọn khóa học trước!");
        await axios.post(`${API_URL}/tests`, { topicId: selectedTopic, questions: testQuestions });
        alert("Đã lưu bài test!");
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Admin Dashboard.</h1>

                {/* Tab Switcher */}
                <div className="flex gap-8 mb-10 border-b-2 border-gray-200">
                    <button onClick={() => setSearchParams({ tab: 'topics' })}
                        className={`pb-4 text-lg font-bold ${activeTab === 'topics' ? 'text-teal-500 border-b-4 border-teal-500' : 'text-gray-400'}`}>
                        QUẢN LÝ KHÓA HỌC
                    </button>
                    <button onClick={() => setSearchParams({ tab: 'test' })}
                        className={`pb-4 text-lg font-bold ${activeTab === 'test' ? 'text-teal-500 border-b-4 border-teal-500' : 'text-gray-400'}`}>
                        QUẢN LÝ BÀI TEST
                    </button>
                </div>

                {activeTab === 'topics' ? (
                    /* PHẦN QUẢN LÝ KHÓA HỌC */
                    <div className="bg-white p-6 rounded-3xl shadow-xl">
                        {/* Thêm code Form thêm/sửa/xóa Topic tại đây */}
                        <h2 className="font-bold mb-4">Danh sách khóa học</h2>
                        {topics.map(t => (
                            <div key={t.id} className="flex justify-between p-4 border-b">
                                <span>{t.name}</span>
                                <button className="text-red-500 font-bold">XÓA</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* PHẦN QUẢN LÝ BÀI TEST - HIỆN FORM THÊM CÂU HỎI */
                    <div className="space-y-6">
                        <select className="p-4 w-full rounded-2xl border" onChange={(e) => setSelectedTopic(e.target.value)}>
                            <option value="">-- Chọn khóa học để tạo bài test --</option>
                            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>

                        {selectedTopic && (
                            <div className="bg-white p-8 rounded-3xl border shadow-lg">
                                <h3 className="text-xl font-bold mb-6 text-teal-600 underline">TẠO CÂU HỎI BÀI TEST</h3>
                                {testQuestions.map((q, idx) => (
                                    <div key={idx} className="mb-8 p-6 bg-gray-50 rounded-2xl border">
                                        <input className="w-full p-3 mb-4 rounded-xl border font-bold" placeholder={`Nội dung câu hỏi ${idx + 1}`}
                                            onChange={e => {
                                                const newQs = [...testQuestions];
                                                newQs[idx].content = e.target.value;
                                                setTestQuestions(newQs);
                                            }} />
                                        <div className="grid grid-cols-2 gap-4">
                                            {['A', 'B', 'C', 'D'].map(opt => (
                                                <input key={opt} className="p-2 border rounded-lg" placeholder={`Đáp án ${opt}`}
                                                    onChange={e => {
                                                        const newQs = [...testQuestions];
                                                        newQs[idx].answers[opt] = e.target.value;
                                                        setTestQuestions(newQs);
                                                    }} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-4">
                                    <button onClick={addQuestionField} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">
                                        + THÊM CÂU HỎI
                                    </button>
                                    <button onClick={handleSaveTest} className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold">
                                        LƯU BÀI TEST
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}