import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function LearnPage() {
    const { id } = useParams(); // Lấy ID chủ đề từ URL (ví dụ: 1)
    const navigate = useNavigate();
    const { user } = useAuth();

    const [vocabList, setVocabList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    // URL API Content Service
    const API_URL = "http://localhost:3000/content";

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                setLoading(true);
                // Gọi API lấy từ vựng theo Topic ID
                const res = await axios.get(`${API_URL}/topics/${id}/vocabulary`);

                if (res.data && res.data.length > 0) {
                    setVocabList(res.data);
                } else {
                    alert("Chủ đề này chưa có từ vựng nào!");
                    navigate('/courses');
                }
            } catch (err) {
                console.error("Lỗi tải bài học:", err);
                alert("Không tìm thấy bài học hoặc lỗi kết nối Server!");
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVocab();
    }, [id, navigate]);

    // Xử lý lật thẻ
    const handleFlip = () => setIsFlipped(!isFlipped);

    // Chuyển từ tiếp theo
    const handleNext = () => {
        setIsFlipped(false); // Úp thẻ xuống trước khi qua từ mới
        if (currentIndex < vocabList.length - 1) {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        } else {
            // Hết bài học
            if (window.confirm("Chúc mừng! Bạn đã học hết từ vựng. Quay về danh sách khóa học?")) {
                navigate('/courses');
            }
        }
    };

    // Quay lại từ trước
    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
        }
    };

    // Phát âm thanh
    const playAudio = (audioUrl) => {
        if (audioUrl) {
            new Audio(audioUrl).play();
        } else {
            // Fallback nếu không có audio file: Dùng giọng chị Google
            const vocab = vocabList[currentIndex];
            const utterance = new SpeechSynthesisUtterance(vocab.word);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Đang tải dữ liệu...</div>;
    if (vocabList.length === 0) return null;

    const currentVocab = vocabList[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            {/* HEADER */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-8">
                <button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-gray-900 font-bold text-sm uppercase tracking-widest">
                    ← Back
                </button>
                <div className="text-teal-500 font-black text-xl tracking-tighter">
                    {currentIndex + 1} / {vocabList.length}
                </div>
            </div>

            {/* FLASHCARD AREA */}
            <div className="relative w-full max-w-md aspect-[4/5] perspective-1000 cursor-pointer group" onClick={handleFlip}>
                <div className={`w-full h-full transition-all duration-500 transform-style-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* MẶT TRƯỚC */}
                    <div className="absolute w-full h-full bg-white rounded-3xl backface-hidden flex flex-col items-center justify-center p-8 border-2 border-gray-100 group-hover:border-teal-200 transition-colors">
                        {currentVocab.imageUrl && (
                            <img
                                src={`http://localhost:3002${currentVocab.imageUrl}`}
                                alt={currentVocab.word}
                                className="w-64 h-64 object-cover rounded-full mb-6 shadow-md"
                            />
                        )}

                        <h2 className="text-5xl font-black text-gray-900 mb-2 text-center">{currentVocab.word}</h2>
                        <p className="text-gray-400 font-medium text-lg mb-6">{currentVocab.ipa}</p>

                        <button
                            onClick={(e) => { e.stopPropagation(); playAudio(currentVocab.audioUrl); }}
                            className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        </button>

                        <p className="mt-8 text-xs font-bold text-gray-300 uppercase tracking-widest">Tap to flip</p>
                    </div>

                    {/* MẶT SAU  */}
                    <div className="absolute w-full h-full bg-teal-500 rounded-3xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-white shadow-teal-200">
                        <h3 className="text-3xl font-bold mb-4 text-center">{currentVocab.meaning}</h3>
                        {currentVocab.exampleSentence && (
                            <div className="mt-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                                <p className="text-lg font-medium italic text-center">"{currentVocab.exampleSentence}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-6 mt-10">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 transition-all font-bold"
                >
                    ←
                </button>

                <button
                    onClick={handleNext}
                    className="px-10 h-14 bg-gray-900 text-white rounded-full font-bold tracking-widest hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-200 transition-all uppercase"
                >
                    {currentIndex === vocabList.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
}