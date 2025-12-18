import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageTests() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [testList, setTestList] = useState([]); // Danh sách các bài test hiện có
    const [editingTestId, setEditingTestId] = useState(null); // Lưu ID bài test đang sửa
    const [questions, setQuestions] = useState([{ content: '', answers: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' }]);
    const API_URL = "http://localhost:3000/content";

    useEffect(() => { axios.get(`${API_URL}/topics`).then(res => setTopics(res.data)); }, []);

    // Lấy danh sách bài test khi chọn Topic
    useEffect(() => {
        if (selectedTopic) {
            axios.get(`${API_URL}/topics/${selectedTopic}/tests`).then(res => setTestList(res.data));
        }
    }, [selectedTopic]);

    const handleAddQuestion = () => setQuestions([...questions, { content: '', answers: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' }]);

    const handleSaveTest = async () => {
        if (!selectedTopic) return alert("Vui lòng chọn khóa học!");

        try {
            if (editingTestId) {
                // Gửi lệnh Cập nhật (PUT)
                await axios.put(`${API_URL}/tests/${editingTestId}`, { questions });
                alert("Đã cập nhật bài test!");
            } else {
                // Gửi lệnh Thêm mới (POST)
                await axios.post(`${API_URL}/tests`, { topicId: selectedTopic, questions });
                alert("Đã tạo bài test mới!");
            }
            resetForm();
            axios.get(`${API_URL}/topics/${selectedTopic}/tests`).then(res => setTestList(res.data));
        } catch (err) { alert("Lỗi khi lưu bài test!"); }
    };

    const handleEdit = (test) => {
        setEditingTestId(test.id);
        setQuestions(test.questions); // Đổ dữ liệu cũ vào form
    };

    const handleDelete = async (testId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài test này?")) return;
        try {
            await axios.delete(`${API_URL}/tests/${testId}`);
            setTestList(testList.filter(t => t.id !== testId));
            alert("Xóa thành công!");
        } catch (err) { alert("Lỗi khi xóa bài test!"); }
    };

    const resetForm = () => {
        setEditingTestId(null);
        setQuestions([{ content: '', answers: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' }]);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Quản lý Bài Test</h1>

            <select className="w-full p-4 border-2 rounded-2xl font-bold" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
                <option value="">-- Chọn khóa học để quản lý bài test --</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* DANH SÁCH BÀI TEST HIỆN CÓ */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="font-bold text-gray-400 uppercase">Bài test đã có</h2>
                    {testList.map((t, idx) => (
                        <div key={t.id} className={`p-4 rounded-2xl border flex justify-between items-center ${editingTestId === t.id ? 'border-teal-500 bg-teal-50' : 'bg-white'}`}>
                            <span className="font-bold">Bài Test #{idx + 1}</span>
                            <div className="flex gap-3">
                                <button onClick={() => handleEdit(t)} className="text-blue-500 text-sm font-bold">SỬA</button>
                                <button onClick={() => handleDelete(t.id)} className="text-red-500 text-sm font-bold">XÓA</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FORM NHẬP CÂU HỎI */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold uppercase text-teal-600">{editingTestId ? `Đang sửa bài test #${editingTestId}` : "Tạo bài test mới"}</h2>
                        {editingTestId && <button onClick={resetForm} className="text-xs font-bold text-gray-400 underline">Hủy sửa</button>}
                    </div>

                    {selectedTopic && questions.map((q, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
                            <input className="w-full p-3 border-b-2 font-bold" placeholder={`Câu hỏi ${idx + 1}`} value={q.content} onChange={e => {
                                const n = [...questions]; n[idx].content = e.target.value; setQuestions(n);
                            }} />
                            <div className="grid grid-cols-2 gap-3">
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <div key={opt} className="flex gap-2 items-center">
                                        <input type="radio" checked={q.correctAnswer === opt} onChange={() => {
                                            const n = [...questions]; n[idx].correctAnswer = opt; setQuestions(n);
                                        }} />
                                        <input className="flex-1 p-2 border rounded-lg text-sm" placeholder={`Đáp án ${opt}`} value={q.answers[opt]} onChange={e => {
                                            const n = [...questions]; n[idx].answers[opt] = e.target.value; setQuestions(n);
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {selectedTopic && (
                        <div className="flex gap-4 pt-4">
                            <button onClick={handleAddQuestion} className="bg-gray-100 px-6 py-4 rounded-2xl font-bold">+ THÊM CÂU</button>
                            <button onClick={handleSaveTest} className="flex-1 bg-teal-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 transition-all hover:bg-teal-600">
                                {editingTestId ? "CẬP NHẬT BÀI TEST" : "LƯU BÀI TEST MỚI"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}