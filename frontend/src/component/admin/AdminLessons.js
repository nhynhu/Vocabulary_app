import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Tabs, Tab, Badge, InputGroup, Row, Col, Card } from 'react-bootstrap';
import ApiService from '../../services/api';
import AdminLayout from './AdminLayout';

// Màu chủ đạo
const primaryColor = '#0f3057';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const AdminLessons = () => {
  const [topics, setTopics] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('topics');

  // Search
  const [searchTopic, setSearchTopic] = useState('');
  const [searchVocab, setSearchVocab] = useState('');
  const [filterTopicId, setFilterTopicId] = useState('');

  // Topic Modal
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({ name: '', imgURL: '' });

  // Vocabulary Modal
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [vocabForm, setVocabForm] = useState({
    word: '',
    ipa: '',
    meaning: '',
    exampleSentence: '',
    exampleMeaning: '',
    audioURL: '',
    imgURL: '',
    topicId: ''
  });
  const [lookingUp, setLookingUp] = useState(false);
  const [dictData, setDictData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto hide alerts
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsData, vocabData] = await Promise.all([
        ApiService.getAdminTopics(),
        ApiService.getAdminVocabulary()
      ]);
      setTopics(Array.isArray(topicsData) ? topicsData : []);
      setVocabulary(Array.isArray(vocabData) ? vocabData : []);
    } catch (error) {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredTopics = topics.filter(t => 
    t.name?.toLowerCase().includes(searchTopic.toLowerCase())
  );

  const filteredVocabulary = vocabulary.filter(v => {
    const matchSearch = v.word?.toLowerCase().includes(searchVocab.toLowerCase()) ||
                       v.meaning?.toLowerCase().includes(searchVocab.toLowerCase());
    const matchTopic = !filterTopicId || v.topicId?.toString() === filterTopicId;
    return matchSearch && matchTopic;
  });

  // Statistics
  const stats = {
    topics: topics.length,
    vocabulary: vocabulary.length,
    avgVocabPerTopic: topics.length > 0 ? Math.round(vocabulary.length / topics.length) : 0
  };

  // ==================== TOPIC HANDLERS ====================
  const handleShowTopicModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({ name: topic.name, imgURL: topic.imgURL || '' });
    } else {
      setEditingTopic(null);
      setTopicForm({ name: '', imgURL: '' });
    }
    setShowTopicModal(true);
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingTopic) {
        await ApiService.updateAdminTopic(editingTopic.topicId, topicForm);
        setSuccess('Cập nhật chủ đề thành công!');
      } else {
        await ApiService.createAdminTopic(topicForm);
        setSuccess('Thêm chủ đề thành công!');
      }
      setShowTopicModal(false);
      fetchData();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm('Xóa chủ đề sẽ xóa tất cả từ vựng và bài test liên quan. Bạn có chắc?')) {
      try {
        await ApiService.deleteAdminTopic(id);
        setSuccess('Xóa chủ đề thành công!');
        fetchData();
      } catch (error) {
        setError('Không thể xóa chủ đề. Có thể còn dữ liệu liên quan.');
      }
    }
  };

  // ==================== VOCABULARY HANDLERS ====================
  const handleShowVocabModal = (vocab = null) => {
    if (vocab) {
      setEditingVocab(vocab);
      setVocabForm({
        word: vocab.word,
        ipa: vocab.ipa || '',
        meaning: vocab.meaning,
        exampleSentence: vocab.exampleSentence || '',
        exampleMeaning: vocab.exampleMeaning || '',
        audioURL: vocab.audioURL || '',
        imgURL: vocab.imgURL || '',
        topicId: vocab.topicId
      });
    } else {
      setEditingVocab(null);
      setVocabForm({
        word: '',
        ipa: '',
        meaning: '',
        exampleSentence: '',
        exampleMeaning: '',
        audioURL: '',
        imgURL: '',
        topicId: topics[0]?.topicId || ''
      });
    }
    setDictData(null);
    setShowVocabModal(true);
  };

  // Lookup từ điển
  const handleLookupWord = async () => {
    if (!vocabForm.word.trim()) {
      setError('Vui lòng nhập từ cần tra');
      return;
    }
    setLookingUp(true);
    setError('');
    try {
      const data = await ApiService.lookupDictionary(vocabForm.word.trim());
      if (data && data[0]) {
        const entry = data[0];
        setDictData(entry);
        
        // Tìm phonetic có text
        const phonetic = entry.phonetics?.find(p => p.text) || {};
        
        // Tìm audio URL - ưu tiên audio từ US hoặc UK
        let audioURL = '';
        if (entry.phonetics && Array.isArray(entry.phonetics)) {
          // Tìm audio có sẵn (không rỗng)
          const audioPhonetic = entry.phonetics.find(p => p.audio && p.audio.trim() !== '');
          if (audioPhonetic) {
            audioURL = audioPhonetic.audio;
          }
        }
        
        const firstMeaning = entry.meanings?.[0];
        const firstDef = firstMeaning?.definitions?.[0];
        
        setVocabForm(prev => ({
          ...prev,
          ipa: phonetic.text || prev.ipa,
          audioURL: audioURL || prev.audioURL,
          exampleSentence: firstDef?.example || prev.exampleSentence,
        }));
        
        if (audioURL) {
          setSuccess('Đã tìm thấy từ trong từ điển (bao gồm phát âm)!');
        } else {
          setSuccess('Đã tìm thấy từ trong từ điển (không có audio phát âm)!');
        }
      } else {
        setError('Không tìm thấy dữ liệu từ điển');
      }
    } catch (err) {
      console.error('Dictionary lookup error:', err);
      setError('Không tìm thấy từ này trong từ điển hoặc lỗi kết nối');
    } finally {
      setLookingUp(false);
    }
  };

  const handleVocabSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        word: vocabForm.word,
        ipa: vocabForm.ipa,
        meaning: vocabForm.meaning,
        exampleSentence: vocabForm.exampleSentence,
        exampleMeaning: vocabForm.exampleMeaning,
        audioURL: vocabForm.audioURL,
        imgURL: vocabForm.imgURL,
        topicId: parseInt(vocabForm.topicId)
      };

      if (editingVocab) {
        await ApiService.updateAdminVocabulary(editingVocab.vocabId, data);
        setSuccess('Cập nhật từ vựng thành công!');
      } else {
        await ApiService.createAdminVocabulary(data);
        setSuccess('Thêm từ vựng thành công!');
      }
      setShowVocabModal(false);
      fetchData();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteVocab = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa từ vựng này?')) {
      try {
        await ApiService.deleteAdminVocabulary(id);
        setSuccess('Xóa từ vựng thành công!');
        fetchData();
      } catch (error) {
        setError('Không thể xóa từ vựng');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý Bài học" subtitle="Quản lý chủ đề và từ vựng">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner animation="border" style={{ width: '3rem', height: '3rem', color: primaryColor }} />
            <p className="mt-3" style={{ color: '#666' }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý Bài học" subtitle="Quản lý chủ đề và từ vựng">
      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3 mb-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-3 mb-3">
          {success}
        </Alert>
      )}

      {/* Statistics */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Body className="text-center">
                <h3 style={{ color: primaryColor }}>{stats.topics}</h3>
                <p className="text-muted mb-0">Chủ đề</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Body className="text-center">
                <h3 style={{ color: primaryColor }}>{stats.vocabulary}</h3>
                <p className="text-muted mb-0">Từ vựng</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Body className="text-center">
                <h3 className="text-info">{stats.avgVocabPerTopic}</h3>
                <p className="text-muted mb-0">TB từ/chủ đề</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
              {/* TOPICS TAB */}
              <Tab eventKey="topics" title={`Chủ đề (${topics.length})`}>
                {/* Search & Add */}
                <div className="d-flex justify-content-between mb-3">
                  <InputGroup style={{ maxWidth: '400px' }}>
                    <Form.Control
                      placeholder="Tìm kiếm chủ đề..."
                      value={searchTopic}
                      onChange={(e) => setSearchTopic(e.target.value)}
                    />
                  </InputGroup>
                  <Button 
                    style={{ backgroundColor: primaryColor, border: 'none' }}
                    className="rounded-pill"
                    onClick={() => handleShowTopicModal()}
                  >
                    Thêm chủ đề
                  </Button>
                </div>

                {filteredTopics.length === 0 ? (
                  <Alert variant="info" className="rounded-3">Không tìm thấy chủ đề nào</Alert>
                ) : (
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên chủ đề</th>
                        <th>Số từ vựng</th>
                        <th>Số bài test</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopics.map(topic => (
                        <tr key={topic.topicId}>
                          <td><Badge bg="secondary">#{topic.topicId}</Badge></td>
                          <td>
                            {topic.imgURL ? (
                              <img 
                                src={topic.imgURL}
                                alt={topic.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span style={{ color: primaryColor, fontWeight: 500 }}>{topic.name}</span>
                          </td>
                          <td><Badge bg="success">{topic.vocabularies?.length || 0} từ</Badge></td>
                          <td><Badge bg="warning" text="dark">{topic.tests?.length || 0} test</Badge></td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleShowTopicModal(topic)}
                            >
                              Sửa
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteTopic(topic.topicId)}
                            >
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Tab>

              {/* VOCABULARY TAB */}
              <Tab eventKey="vocabulary" title={`Từ vựng (${vocabulary.length})`}>
                {/* Search & Filter */}
                <Row className="mb-3">
                  <Col md={5}>
                    <InputGroup>
                      <Form.Control
                        placeholder="Tìm kiếm từ vựng..."
                        value={searchVocab}
                        onChange={(e) => setSearchVocab(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Form.Select
                      value={filterTopicId}
                      onChange={(e) => setFilterTopicId(e.target.value)}
                    >
                      <option value="">-- Tất cả chủ đề --</option>
                      {topics.map(t => (
                        <option key={t.topicId} value={t.topicId}>{t.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button 
                      style={{ backgroundColor: primaryColor, border: 'none' }}
                      className="rounded-pill"
                      onClick={() => handleShowVocabModal()}
                    >
                      Thêm từ vựng
                    </Button>
                  </Col>
                </Row>

                {filteredVocabulary.length === 0 ? (
                  <Alert variant="info" className="rounded-3">Không tìm thấy từ vựng nào</Alert>
                ) : (
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table hover responsive className="mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>ID</th>
                          <th>Hình</th>
                          <th>Từ</th>
                          <th>IPA</th>
                          <th>Nghĩa</th>
                          <th>Chủ đề</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVocabulary.map(vocab => (
                          <tr key={vocab.vocabId}>
                            <td><Badge bg="secondary">#{vocab.vocabId}</Badge></td>
                            <td>
                              {vocab.imgURL ? (
                                <img 
                                  src={vocab.imgURL.startsWith('http') ? vocab.imgURL : `${API_BASE_URL}${vocab.imgURL}`}
                                  alt={vocab.word}
                                  style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <strong style={{ color: primaryColor }}>{vocab.word}</strong>
                              {vocab.audioURL && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 ms-1"
                                  onClick={() => new Audio(vocab.audioURL).play()}
                                >
                                  Nghe
                                </Button>
                              )}
                            </td>
                            <td className="text-muted small">{vocab.ipa || '-'}</td>
                            <td>{vocab.meaning}</td>
                            <td><Badge bg="info">{vocab.topic?.name || '-'}</Badge></td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleShowVocabModal(vocab)}
                              >
                                Sửa
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteVocab(vocab.vocabId)}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Topic Modal */}
        <Modal show={showTopicModal} onHide={() => setShowTopicModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>{editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleTopicSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Tên chủ đề <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  placeholder="VD: Animals, Food, Travel..."
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>URL hình ảnh chủ đề</Form.Label>
                <Form.Control
                  type="url"
                  value={topicForm.imgURL}
                  onChange={(e) => setTopicForm({ ...topicForm, imgURL: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {topicForm.imgURL && (
                  <div className="mt-2">
                    <img 
                      src={topicForm.imgURL} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger d-block"
                      onClick={() => setTopicForm({...topicForm, imgURL: ''})}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowTopicModal(false)}>Hủy</Button>
              <Button 
                type="submit"
                style={{ backgroundColor: primaryColor, border: 'none' }}
              >
                {editingTopic ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Vocabulary Modal */}
        <Modal show={showVocabModal} onHide={() => setShowVocabModal(false)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>{editingVocab ? 'Sửa từ vựng' : 'Thêm từ vựng'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleVocabSubmit}>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Form.Group className="mb-3">
                <Form.Label>Chủ đề <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={vocabForm.topicId}
                  onChange={(e) => setVocabForm({ ...vocabForm, topicId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Từ tiếng Anh <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={vocabForm.word}
                    onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                    placeholder="VD: cat, dog, apple..."
                    required
                  />
                  <Button 
                    variant="outline-primary" 
                    onClick={handleLookupWord}
                    disabled={lookingUp}
                  >
                    {lookingUp ? <Spinner size="sm" /> : 'Tra từ điển'}
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">
                  Nhập từ và nhấn "Tra từ điển" để tự động lấy phiên âm và ví dụ
                </Form.Text>
              </Form.Group>

              {/* Hiển thị kết quả từ điển */}
              {dictData && (
                <Alert variant="info" className="mb-3">
                  <strong>Kết quả từ điển:</strong>
                  <div className="mt-2">
                    {dictData.meanings?.map((meaning, idx) => (
                      <div key={idx} className="mb-2">
                        <Badge bg="secondary" className="me-2">{meaning.partOfSpeech}</Badge>
                        <ul className="mb-0 small">
                          {meaning.definitions?.slice(0, 2).map((def, i) => (
                            <li key={i}>
                              {def.definition}
                              {def.example && <em className="text-muted d-block">"{def.example}"</em>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Alert>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>IPA (phiên âm)</Form.Label>
                    <Form.Control
                      type="text"
                      value={vocabForm.ipa}
                      onChange={(e) => setVocabForm({ ...vocabForm, ipa: e.target.value })}
                      placeholder="VD: /kæt/"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Audio URL</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={vocabForm.audioURL}
                        onChange={(e) => setVocabForm({ ...vocabForm, audioURL: e.target.value })}
                        placeholder="URL file âm thanh"
                      />
                      {vocabForm.audioURL && (
                        <Button 
                          variant="outline-secondary"
                          onClick={() => new Audio(vocabForm.audioURL).play()}
                        >
                          Play
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Nghĩa tiếng Việt <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={vocabForm.meaning}
                  onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                  placeholder="VD: con mèo"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Câu ví dụ (tiếng Anh)</Form.Label>
                    <Form.Control
                      type="text"
                      value={vocabForm.exampleSentence}
                      onChange={(e) => setVocabForm({ ...vocabForm, exampleSentence: e.target.value })}
                      placeholder="VD: The cat is sleeping."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nghĩa câu ví dụ (tiếng Việt)</Form.Label>
                    <Form.Control
                      type="text"
                      value={vocabForm.exampleMeaning}
                      onChange={(e) => setVocabForm({ ...vocabForm, exampleMeaning: e.target.value })}
                      placeholder="VD: Con mèo đang ngủ."
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* URL hình ảnh */}
              <Form.Group className="mb-3">
                <Form.Label>URL hình ảnh minh họa</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={vocabForm.imgURL}
                  onChange={(e) => setVocabForm({...vocabForm, imgURL: e.target.value})}
                />
                {vocabForm.imgURL && (
                  <div className="mt-2">
                    <img 
                      src={vocabForm.imgURL} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger"
                      onClick={() => setVocabForm({...vocabForm, imageUrl: ''})}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowVocabModal(false)}>Hủy</Button>
              <Button 
                type="submit"
                style={{ backgroundColor: primaryColor, border: 'none' }}
              >
                {editingVocab ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
    </AdminLayout>
  );
};

export default AdminLessons;
