import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TestDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [flags, setFlags] = useState({}); // Lưu trạng thái gắn cờ
    const [score, setScore] = useState(null);

    useEffect(() => {
        // Gọi API lấy chi tiết bài test kèm câu hỏi qua Gateway cổng 3000
        axios.get(`http://localhost:3000/content/tests/${id}`)
            .then(res => setTest(res.data))
            .catch(err => {
                console.error(err);
                alert("Không tìm thấy bài test này!"); //
            });
    }, [id]);

    if (!test) return <div className="p-20 text-center font-bold text-gray-400">Đang tải câu hỏi...</div>; //

    // Chức năng Gắn cờ
    const toggleFlag = (idx) => {
        setFlags(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleNext = () => {
        if (currentIdx < test.questions.length - 1) setCurrentIdx(currentIdx + 1);
        else submitTest();
    };

    const submitTest = () => {
        if (!window.confirm("Bạn có chắc muốn nộp bài?")) return;
        let correctCount = 0;
        test.questions.forEach((q, i) => {
            if (userAnswers[i] === q.correctAnswer) correctCount++;
        });
        setScore(Math.round((correctCount / test.questions.length) * 100));
    };

    if (score !== null) return (
        <div className="min-h-screen flex items-center justify-center bg-teal-500 p-6">
            <div className="bg-white p-12 rounded-3xl text-center shadow-2xl max-w-sm w-full">
                <h2 className="text-4xl font-black mb-4">KẾT QUẢ</h2>
                <div className="text-6xl font-black text-teal-500 mb-8">{score}đ</div>
                <button onClick={() => navigate('/tests')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">QUAY LẠI</button>
            </div>
        </div>
    );

    const q = test.questions[currentIdx];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto">

            {/* CỘT TRÁI: NỘI DUNG CÂU HỎI */}
            <div className="flex-1 w-full">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 relative">
                    {/* Nút gắn cờ */}
                    <button
                        onClick={() => toggleFlag(currentIdx)}
                        className={`absolute top-6 right-6 p-2 rounded-lg transition-all ${flags[currentIdx] ? 'bg-orange-100 text-orange-500' : 'text-gray-300 hover:text-orange-400'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.104.054a8.25 8.25 0 005.292.508l2.73-.684a.75.75 0 01.938.728v10.5a.75.75 0 01-1.012.707l-2.73.684a9.75 9.75 0 01-6.725-.738l-.104-.054a8.25 8.25 0 00-5.292-.508l-1.838.46v6.49a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <h2 className="text-sm font-black text-teal-500 mb-6 uppercase tracking-widest">CÂU HỎI {currentIdx + 1}</h2>
                    <h1 className="text-3xl font-bold mb-10 text-gray-900 leading-tight">{q.content}</h1>

                    <div className="grid gap-4">
                        {['A', 'B', 'C', 'D'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setUserAnswers({ ...userAnswers, [currentIdx]: opt })}
                                className={`p-5 text-left rounded-2xl border-2 font-bold transition-all flex items-center gap-4 ${userAnswers[currentIdx] === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${userAnswers[currentIdx] === opt ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200 text-gray-400'}`}>{opt}</span>
                                {q.answers[opt]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center px-4">
                    <button onClick={() => setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0} className="px-6 py-3 font-bold text-gray-400 disabled:opacity-0 transition-all">← TRƯỚC</button>
                    <button onClick={handleNext} className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg shadow-gray-200">
                        {currentIdx === test.questions.length - 1 ? "NỘP BÀI" : "TIẾP THEO →"}
                    </button>
                </div>
            </div>

            {/* CỘT PHẢI: LƯỚI CÂU HỎI (QUESTION GRID) */}
            <div className="w-full lg:w-80 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black mb-6 uppercase tracking-tighter text-gray-800">Tiến trình bài làm</h3>
                <div className="grid grid-cols-5 gap-3">
                    {test.questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIdx(i)}
                            className={`relative h-12 rounded-xl font-bold transition-all border-2 
                ${currentIdx === i ? 'border-teal-500 scale-110 z-10' : 'border-transparent'}
                ${userAnswers[i] ? 'bg-teal-500 text-white shadow-md shadow-teal-100' : 'bg-gray-100 text-gray-400'}
              `}
                        >
                            {i + 1}
                            {/* Icon gắn cờ nhỏ trên lưới */}
                            {flags[i] && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <div className="w-4 h-4 bg-teal-500 rounded shadow-sm"></div> Đã làm
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <div className="w-4 h-4 bg-orange-500 rounded shadow-sm"></div> Đã gắn cờ
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                        <div className="w-4 h-4 bg-gray-100 rounded shadow-sm border border-gray-200"></div> Chưa làm
                    </div>
                </div>
            </div>
        </div>
    );
}