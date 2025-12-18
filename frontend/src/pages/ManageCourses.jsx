import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageCourses() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [topicName, setTopicName] = useState('');
    const [vocabForm, setVocabForm] = useState({
        word: '', ipa: '', meaning: '', exampleSentence: '', audioUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [vocabList, setVocabList] = useState([]);
    const [editingVocabId, setEditingVocabId] = useState(null);
    const API_URL = "http://localhost:3000/content";

    useEffect(() => { fetchTopics(); }, []);
    useEffect(() => { if (selectedTopic) fetchVocab(); }, [selectedTopic]);

    const fetchTopics = async () => { const res = await axios.get(`${API_URL}/topics`); setTopics(res.data); };
    const fetchVocab = async () => { const res = await axios.get(`${API_URL}/topics/${selectedTopic}/vocabulary`); setVocabList(res.data); };

    const fetchExternalData = async () => {
        if (!vocabForm.word) return alert("Vui lòng nhập từ tiếng Anh trước!");
        try {
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${vocabForm.word.trim().toLowerCase()}`);
            const data = res.data[0];
            const ipaText = data.phonetic || data.phonetics.find(p => p.text)?.text || "";
            const audioObj = data.phonetics.find(p => p.audio && p.audio.length > 0);
            const audioLink = audioObj ? audioObj.audio : "";
            let exampleStr = "";
            for (const meaning of data.meanings) {
                const found = meaning.definitions.find(d => d.example);
                if (found) { exampleStr = found.example; break; }
            }
            setVocabForm(prev => ({ ...prev, ipa: ipaText, audioUrl: audioLink, exampleSentence: exampleStr }));
        } catch (err) { alert("Không tìm thấy dữ liệu!"); }
    };

    const handleSaveVocab = async () => {
        if (!selectedTopic) return alert("Vui lòng chọn khóa học!");
        const formData = new FormData();
        Object.keys(vocabForm).forEach(key => formData.append(key, vocabForm[key]));
        formData.append('topicId', selectedTopic);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (editingVocabId) {
                // Chế độ Cập nhật
                await axios.put(`${API_URL}/vocabulary/${editingVocabId}`, formData);
                alert("Cập nhật từ vựng thành công!");
            } else {
                // Chế độ Thêm mới
                await axios.post(`${API_URL}/vocabulary`, formData);
                alert("Thêm từ vựng thành công!");
            }
            resetForm();
            fetchVocab();
        } catch (err) { alert("Lỗi khi lưu từ vựng!"); }
    };

    const handleDeleteVocab = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa từ vựng này?")) return;
        try {
            await axios.delete(`${API_URL}/vocabulary/${id}`);
            fetchVocab();
        } catch (err) { alert("Lỗi khi xóa từ vựng!"); }
    };

    const handleEditVocab = (vocab) => {
        setEditingVocabId(vocab.id);
        setVocabForm({
            word: vocab.word,
            ipa: vocab.ipa || '',
            meaning: vocab.meaning,
            exampleSentence: vocab.exampleSentence || '',
            audioUrl: vocab.audioUrl || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setVocabForm({ word: '', ipa: '', meaning: '', exampleSentence: '', audioUrl: '' });
        setImageFile(null);
        setEditingVocabId(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">1. Khóa học</h2>
                <div className="flex gap-2">
                    <input className="flex-1 p-3 border rounded-xl font-bold outline-none focus:border-teal-500" value={topicName} onChange={e => setTopicName(e.target.value)} placeholder="Tên khóa học..." />
                    <button onClick={() => axios.post(`${API_URL}/topics`, { name: topicName }).then(fetchTopics)} className="bg-teal-500 text-white px-6 rounded-xl font-bold hover:bg-teal-600 transition-colors">LƯU</button>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {topics.map(t => (
                        <div key={t.id} className={`p-4 rounded-2xl flex justify-between items-center border cursor-pointer transition-all ${selectedTopic == t.id ? 'border-teal-500 bg-teal-50 shadow-sm' : 'bg-white hover:border-gray-300'}`} onClick={() => setSelectedTopic(t.id)}>
                            <span className="font-bold">{t.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Xóa khóa học?")) axios.delete(`${API_URL}/topics/${t.id}`).then(fetchTopics); }} className="text-red-500 font-bold hover:bg-red-50 p-2 rounded-lg text-sm">XÓA</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">2. {editingVocabId ? "Sửa Từ Vựng" : "Thêm Từ Vựng"} {selectedTopic && `- ${topics.find(t => t.id == selectedTopic)?.name}`}</h2>
                {selectedTopic ? (
                    <div className="space-y-6">
                        {/* FORM NHẬP */}
                        <div className="bg-white p-6 rounded-3xl border shadow-lg space-y-4">
                            <div className="flex gap-2">
                                <input className="flex-1 p-3 bg-gray-50 rounded-xl font-bold outline-none focus:border-blue-500" placeholder="Nhập từ tiếng Anh..." value={vocabForm.word} onChange={e => setVocabForm({ ...vocabForm, word: e.target.value })} />
                                <button onClick={fetchExternalData} className="bg-blue-600 text-white px-4 rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-colors">Lấy dữ liệu</button>
                            </div>

                            <div className="border-2 border-dashed border-gray-100 rounded-xl p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => document.getElementById('fInput').click()}>
                                <input type="file" id="fInput" hidden onChange={e => setImageFile(e.target.files[0])} />
                                {imageFile ? <img src={URL.createObjectURL(imageFile)} className="h-32 mx-auto object-cover rounded-lg shadow-sm" alt="Preview" /> : <p className="text-gray-400 text-sm font-medium">Chọn ảnh minh họa</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white border focus:border-gray-200" placeholder="/ipa/" value={vocabForm.ipa} onChange={e => setVocabForm({ ...vocabForm, ipa: e.target.value })} />
                                <input className="p-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white border focus:border-gray-200" placeholder="Nghĩa..." value={vocabForm.meaning} onChange={e => setVocabForm({ ...vocabForm, meaning: e.target.value })} />
                            </div>

                            <textarea className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white border focus:border-gray-200" placeholder="Ví dụ minh họa..." rows="2" value={vocabForm.exampleSentence} onChange={e => setVocabForm({ ...vocabForm, exampleSentence: e.target.value })} />

                            {vocabForm.audioUrl && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                                    <audio controls src={vocabForm.audioUrl} className="h-8 flex-1" />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button onClick={handleSaveVocab} className="flex-1 bg-gray-900 text-white p-4 rounded-2xl font-black hover:bg-teal-500 transition-all">{editingVocabId ? "CẬP NHẬT" : "LƯU TỪ VỰNG"}</button>
                                {editingVocabId && <button onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 rounded-2xl font-bold">HỦY</button>}
                            </div>
                        </div>

                        {/* DANH SÁCH TỪ ĐÃ THÊM */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-500 uppercase text-sm ml-2">Từ vựng đã có ({vocabList.length})</h3>
                            {vocabList.map(v => (
                                <div key={v.id} className="bg-white p-4 rounded-2xl border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    {v.imageUrl && <img src={`http://localhost:3000${v.imageUrl}`} className="w-12 h-12 rounded-lg object-cover" alt={v.word} />}
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{v.word} <span className="text-gray-400 font-normal ml-1">/{v.ipa}/</span></p>
                                        <p className="text-sm text-gray-500 truncate w-40">{v.meaning}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditVocab(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-xs uppercase">Sửa</button>
                                        <button onClick={() => handleDeleteVocab(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs uppercase">Xóa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 italic">Chọn một khóa học bên trái</p>
                    </div>
                )}
            </div>
        </div>
    );
}