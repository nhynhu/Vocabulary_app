// Dữ liệu mẫu cho tìm kiếm
export const searchData = {
  topics: [
    { id: 1, name: 'Animals', nameVi: 'Động vật', description: 'Từ vựng về các loài động vật', wordCount: 25 },
    { id: 2, name: 'Fruits', nameVi: 'Trái cây', description: 'Từ vựng về các loại trái cây', wordCount: 18 },
    { id: 3, name: 'Colors', nameVi: 'Màu sắc', description: 'Từ vựng về màu sắc', wordCount: 12 },
    { id: 4, name: 'Food', nameVi: 'Thức ăn', description: 'Từ vựng về đồ ăn thức uống', wordCount: 30 },
    { id: 5, name: 'Family', nameVi: 'Gia đình', description: 'Từ vựng về các thành viên gia đình', wordCount: 15 },
    { id: 6, name: 'School', nameVi: 'Trường học', description: 'Từ vựng về môi trường học tập', wordCount: 22 },
  ],
  
  vocabulary: [
    { english: 'Cat', vietnamese: 'Con mèo', topic: 'Animals' },
    { english: 'Dog', vietnamese: 'Con chó', topic: 'Animals' },
    { english: 'Apple', vietnamese: 'Quả táo', topic: 'Fruits' },
    { english: 'Banana', vietnamese: 'Quả chuối', topic: 'Fruits' },
    { english: 'Red', vietnamese: 'Màu đỏ', topic: 'Colors' },
    { english: 'Blue', vietnamese: 'Màu xanh dương', topic: 'Colors' },
    { english: 'Rice', vietnamese: 'Cơm', topic: 'Food' },
    { english: 'Water', vietnamese: 'Nước', topic: 'Food' },
    { english: 'Mother', vietnamese: 'Mẹ', topic: 'Family' },
    { english: 'Father', vietnamese: 'Bố', topic: 'Family' },
    { english: 'Book', vietnamese: 'Sách', topic: 'School' },
    { english: 'Pen', vietnamese: 'Bút', topic: 'School' },
    { english: 'Elephant', vietnamese: 'Con voi', topic: 'Animals' },
    { english: 'Orange', vietnamese: 'Quả cam', topic: 'Fruits' },
    { english: 'Green', vietnamese: 'Màu xanh lá', topic: 'Colors' },
    { english: 'Bread', vietnamese: 'Bánh mì', topic: 'Food' },
    { english: 'Sister', vietnamese: 'Chị/Em gái', topic: 'Family' },
    { english: 'Teacher', vietnamese: 'Giáo viên', topic: 'School' },
  ]
};

// Hàm tìm kiếm
export const performSearch = (query, filterType = 'all') => {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = query.toLowerCase();
  let results = [];

  if (filterType === 'all' || filterType === 'topics') {
    const topicResults = searchData.topics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm) ||
      topic.nameVi.toLowerCase().includes(searchTerm) ||
      topic.description.toLowerCase().includes(searchTerm)
    ).map(topic => ({ ...topic, type: 'topic' }));
    results.push(...topicResults);
  }

  if (filterType === 'all' || filterType === 'vocabulary') {
    const vocabResults = searchData.vocabulary.filter(word => 
      word.english.toLowerCase().includes(searchTerm) ||
      word.vietnamese.toLowerCase().includes(searchTerm) ||
      word.topic.toLowerCase().includes(searchTerm)
    ).map(word => ({ ...word, type: 'vocabulary' }));
    results.push(...vocabResults);
  }

  return results;
};
