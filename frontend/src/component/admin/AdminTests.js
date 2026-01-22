import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Badge, InputGroup, Row, Col, Card } from 'react-bootstrap';
import ApiService from '../../services/api';
import AdminLayout from './AdminLayout';

// Màu chủ đạo
const primaryColor = '#0f3057';

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [topics, setTopics] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [searchTest, setSearchTest] = useState('');
  const [filterTopicId, setFilterTopicId] = useState('');

  // Test Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [testForm, setTestForm] = useState({ topicId: '', maxScore: 100, imgURL: '' });

  // Question Modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    content: '',
    type: 'multiple_choice',
    answers: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 1,
    relatedVocabId: ''
  });

  // View Questions
  const [showQuestionsView, setShowQuestionsView] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);

  // Quick Create from Vocab
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [selectedVocabs, setSelectedVocabs] = useState([]);
  const [quickCreateTopicId, setQuickCreateTopicId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [testsData, topicsData, vocabData] = await Promise.all([
        ApiService.getAdminTests(),
        ApiService.getAdminTopics(),
        ApiService.getAdminVocabulary()
      ]);
      setTests(Array.isArray(testsData) ? testsData : []);
      setTopics(Array.isArray(topicsData) ? topicsData : []);
      setVocabulary(Array.isArray(vocabData) ? vocabData : []);
    } catch (error) {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Filter tests
  const filteredTests = tests.filter(test => {
    const topicName = test.topic?.name || '';
    const matchSearch = topicName.toLowerCase().includes(searchTest.toLowerCase());
    const matchTopic = !filterTopicId || test.topicId?.toString() === filterTopicId;
    return matchSearch && matchTopic;
  });

  // Statistics
  const stats = {
    tests: tests.length,
    questions: tests.reduce((sum, t) => sum + (t.questions?.length || 0), 0),
    avgQuestions: tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + (t.questions?.length || 0), 0) / tests.length) : 0
  };

  // ==================== TEST HANDLERS ====================
  const handleShowTestModal = (test = null) => {
    if (test) {
      setEditingTest(test);
      setTestForm({ 
        topicId: test.topicId, 
        maxScore: test.maxScore, 
        imgURL: test.imgURL || '',
        title: test.title || '',
        timeLimit: test.timeLimit || 120
      });
    } else {
      setEditingTest(null);
      setTestForm({ 
        topicId: topics[0]?.topicId || '', 
        maxScore: 100, 
        imgURL: '',
        title: '',
        timeLimit: 120
      });
    }
    setShowTestModal(true);
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        topicId: parseInt(testForm.topicId),
        maxScore: parseInt(testForm.maxScore),
        imgURL: testForm.imgURL,
        title: testForm.title,
        timeLimit: parseInt(testForm.timeLimit) || 120
      };
      if (editingTest) {
        await ApiService.updateAdminTest(editingTest.testId, data);
        setSuccess('Cập nhật bài kiểm tra thành công!');
      } else {
        await ApiService.createAdminTest(data);
        setSuccess('Thêm bài kiểm tra thành công!');
      }
      setShowTestModal(false);
      fetchData();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Xóa bài kiểm tra sẽ xóa tất cả câu hỏi. Bạn có chắc?')) {
      try {
        await ApiService.deleteAdminTest(id);
        setSuccess('Xóa bài kiểm tra thành công!');
        fetchData();
      } catch (error) {
        setError('Không thể xóa bài kiểm tra');
      }
    }
  };

  // ==================== QUESTION HANDLERS ====================
  const handleViewQuestions = (test) => {
    setViewingTest(test);
    setShowQuestionsView(true);
  };

  const handleShowQuestionModal = (testId, question = null) => {
    setCurrentTestId(testId);
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        content: question.content,
        type: question.type,
        answers: question.answers || ['', '', '', ''],
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        relatedVocabId: question.relatedVocabId || ''
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        content: '',
        type: 'multiple_choice',
        answers: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 1,
        relatedVocabId: ''
      });
    }
    setShowQuestionModal(true);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        content: questionForm.content,
        type: questionForm.type,
        answers: questionForm.answers.filter(a => a.trim()),
        correctAnswer: questionForm.correctAnswer,
        difficulty: parseInt(questionForm.difficulty),
        relatedVocabId: questionForm.relatedVocabId ? parseInt(questionForm.relatedVocabId) : null,
        testId: currentTestId
      };

      if (editingQuestion) {
        await ApiService.updateAdminQuestion(editingQuestion.questionId, data);
        setSuccess('Cập nhật câu hỏi thành công!');
      } else {
        await ApiService.createAdminQuestion(data);
        setSuccess('Thêm câu hỏi thành công!');
      }
      setShowQuestionModal(false);
      fetchData();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      try {
        await ApiService.deleteAdminQuestion(id);
        setSuccess('Xóa câu hỏi thành công!');
        fetchData();
      } catch (error) {
        setError('Không thể xóa câu hỏi');
      }
    }
  };

  const handleDuplicateQuestion = async (question) => {
    try {
      const data = {
        content: question.content + ' (copy)',
        type: question.type,
        answers: question.answers,
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        relatedVocabId: question.relatedVocabId,
        testId: question.testId
      };
      await ApiService.createAdminQuestion(data);
      setSuccess('Nhân bản câu hỏi thành công!');
      fetchData();
    } catch (error) {
      setError('Không thể nhân bản câu hỏi');
    }
  };

  // ==================== QUICK CREATE ====================
  const handleShowQuickCreate = (testId, topicId) => {
    setCurrentTestId(testId);
    setQuickCreateTopicId(topicId);
    setSelectedVocabs([]);
    setShowQuickCreate(true);
  };

  const toggleVocabSelection = (vocabId) => {
    setSelectedVocabs(prev => 
      prev.includes(vocabId) 
        ? prev.filter(id => id !== vocabId)
        : [...prev, vocabId]
    );
  };

  const handleQuickCreateSubmit = async () => {
    if (selectedVocabs.length === 0) {
      setError('Vui lòng chọn ít nhất một từ vựng');
      return;
    }
    try {
      for (const vocabId of selectedVocabs) {
        const vocab = vocabulary.find(v => v.vocabId === vocabId);
        if (vocab) {
          const wrongAnswers = vocabulary
            .filter(v => v.vocabId !== vocabId && v.topicId === vocab.topicId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(v => v.meaning);
          
          const allAnswers = [vocab.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
          
          await ApiService.createAdminQuestion({
            content: `"${vocab.word}" có nghĩa là gì?`,
            type: 'multiple_choice',
            answers: allAnswers,
            correctAnswer: vocab.meaning,
            difficulty: 1,
            relatedVocabId: vocab.vocabId,
            testId: currentTestId
          });
        }
      }
      setSuccess(`Đã tạo ${selectedVocabs.length} câu hỏi từ từ vựng!`);
      setShowQuickCreate(false);
      fetchData();
    } catch (error) {
      setError('Có lỗi khi tạo câu hỏi');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý Bài kiểm tra" subtitle="Quản lý bài test và câu hỏi">
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
    <AdminLayout title="Quản lý Bài kiểm tra" subtitle="Quản lý bài test và câu hỏi">
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
                <h3 style={{ color: primaryColor }}>{stats.tests}</h3>
                <p className="text-muted mb-0">Bài kiểm tra</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Body className="text-center">
                <h3 style={{ color: primaryColor }}>{stats.questions}</h3>
                <p className="text-muted mb-0">Tổng câu hỏi</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Body className="text-center">
                <h3 style={{ color: primaryColor }}>{stats.avgQuestions}</h3>
                <p className="text-muted mb-0">TB câu hỏi/test</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Body>
            {/* Search & Filter */}
            <Row className="mb-3">
              <Col md={5}>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm kiếm theo tên chủ đề..."
                    value={searchTest}
                    onChange={(e) => setSearchTest(e.target.value)}
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
                  onClick={() => handleShowTestModal()}
                >
                  Thêm bài test
                </Button>
              </Col>
            </Row>

            {/* Tests Table */}
            {filteredTests.length === 0 ? (
              <Alert variant="info" className="rounded-3">Không tìm thấy bài kiểm tra nào</Alert>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Chủ đề</th>
                    <th>Số câu hỏi</th>
                    <th>Điểm tối đa</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map(test => (
                    <tr key={test.testId}>
                      <td><Badge bg="secondary">#{test.testId}</Badge></td>
                      <td>
                        <span style={{ color: primaryColor, fontWeight: 500 }}>
                          {test.topic?.name || 'N/A'}
                        </span>
                      </td>
                      <td><Badge bg="info">{test.questions?.length || 0} câu</Badge></td>
                      <td><Badge bg="warning" text="dark">{test.maxScore} điểm</Badge></td>
                      <td>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewQuestions(test)}
                        >
                          Câu hỏi
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleShowQuickCreate(test.testId, test.topicId)}
                        >
                          Tạo nhanh
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleShowTestModal(test)}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteTest(test.testId)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Test Modal */}
        <Modal show={showTestModal} onHide={() => setShowTestModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>{editingTest ? 'Sửa bài kiểm tra' : 'Thêm bài kiểm tra'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleTestSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Chủ đề <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={testForm.topicId}
                  onChange={(e) => setTestForm({ ...testForm, topicId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map(t => (
                    <option key={t.topicId} value={t.topicId}>{t.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tên bài test</Form.Label>
                <Form.Control
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  placeholder="Ví dụ: Ôn tập Topic 1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Điểm tối đa <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  value={testForm.maxScore}
                  onChange={(e) => setTestForm({ ...testForm, maxScore: e.target.value })}
                  min="1"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Thời gian làm bài (giây) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  value={testForm.timeLimit}
                  onChange={(e) => setTestForm({ ...testForm, timeLimit: e.target.value })}
                  min="30"
                  required
                />
                <Form.Text className="text-muted">
                  Mặc định: 120 giây (2 phút)
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>URL hình ảnh bài test</Form.Label>
                <Form.Control
                  type="url"
                  value={testForm.imgURL}
                  onChange={(e) => setTestForm({ ...testForm, imgURL: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {testForm.imgURL && (
                  <div className="mt-2">
                    <img 
                      src={testForm.imgURL} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger d-block"
                      onClick={() => setTestForm({...testForm, imgURL: ''})}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowTestModal(false)}>Hủy</Button>
              <Button type="submit" style={{ backgroundColor: primaryColor, border: 'none' }}>
                {editingTest ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Questions View Modal */}
        <Modal show={showQuestionsView} onHide={() => setShowQuestionsView(false)} size="xl" centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>
              Câu hỏi - {viewingTest?.topic?.name} 
              <Badge bg="light" text="dark" className="ms-2">{viewingTest?.questions?.length || 0} câu</Badge>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="mb-3">
              <Button 
                variant="success" 
                className="rounded-pill"
                onClick={() => handleShowQuestionModal(viewingTest?.testId)}
              >
                Thêm câu hỏi
              </Button>
            </div>
            {viewingTest?.questions?.length === 0 ? (
              <Alert variant="info" className="rounded-3">Chưa có câu hỏi nào</Alert>
            ) : (
              <Table hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nội dung</th>
                    <th>Loại</th>
                    <th>Đáp án</th>
                    <th>Độ khó</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingTest?.questions?.map(q => (
                    <tr key={q.questionId}>
                      <td><Badge bg="secondary">#{q.questionId}</Badge></td>
                      <td style={{ maxWidth: '250px' }}>{q.content}</td>
                      <td><Badge bg="info">{q.type}</Badge></td>
                      <td>
                        <Badge bg="success">{q.correctAnswer}</Badge>
                        <div className="small text-muted mt-1">
                          {q.answers?.slice(0, 3).join(', ')}...
                        </div>
                      </td>
                      <td>
                        {q.difficulty}
                      </td>
                      <td>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleDuplicateQuestion(q)}
                        >
                          Copy
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleShowQuestionModal(viewingTest.testId, q)}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteQuestion(q.questionId)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>
        </Modal>

        {/* Question Modal */}
        <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>{editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleQuestionSubmit}>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Form.Group className="mb-3">
                <Form.Label>Nội dung câu hỏi <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                  placeholder='VD: "Apple" có nghĩa là gì?'
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại câu hỏi</Form.Label>
                    <Form.Select
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                    >
                      <option value="multiple_choice">Trắc nghiệm</option>
                      <option value="fill_blank">Điền từ</option>
                      <option value="true_false">Đúng/Sai</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Độ khó</Form.Label>
                    <Form.Select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    >
                      <option value="1">Dễ</option>
                      <option value="2">Trung bình</option>
                      <option value="3">Khó</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Các đáp án (nhập tối đa 4 đáp án)</Form.Label>
                {[0, 1, 2, 3].map(i => (
                  <Form.Control
                    key={i}
                    type="text"
                    className="mb-2"
                    placeholder={`Đáp án ${i + 1}`}
                    value={questionForm.answers[i] || ''}
                    onChange={(e) => {
                      const newAnswers = [...questionForm.answers];
                      newAnswers[i] = e.target.value;
                      setQuestionForm({ ...questionForm, answers: newAnswers });
                    }}
                  />
                ))}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Đáp án đúng <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                  required
                >
                  <option value="">-- Chọn đáp án đúng --</option>
                  {questionForm.answers.filter(a => a.trim()).map((ans, i) => (
                    <option key={i} value={ans}>{ans}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Từ vựng liên quan (tùy chọn)</Form.Label>
                <Form.Select
                  value={questionForm.relatedVocabId}
                  onChange={(e) => setQuestionForm({ ...questionForm, relatedVocabId: e.target.value })}
                >
                  <option value="">-- Không chọn --</option>
                  {vocabulary.map(v => (
                    <option key={v.vocabId} value={v.vocabId}>{v.word} - {v.meaning}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>Hủy</Button>
              <Button type="submit" style={{ backgroundColor: primaryColor, border: 'none' }}>
                {editingQuestion ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Quick Create Modal */}
        <Modal show={showQuickCreate} onHide={() => setShowQuickCreate(false)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>Tạo nhanh câu hỏi từ từ vựng</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <p className="text-muted">Chọn từ vựng để tự động tạo câu hỏi trắc nghiệm:</p>
            <div className="mb-3">
              <Badge bg="primary">{selectedVocabs.length} từ đã chọn</Badge>
            </div>
            <Table hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>Chọn</th>
                  <th>Từ</th>
                  <th>Nghĩa</th>
                </tr>
              </thead>
              <tbody>
                {vocabulary.filter(v => v.topicId === quickCreateTopicId).map(vocab => (
                  <tr key={vocab.vocabId} onClick={() => toggleVocabSelection(vocab.vocabId)} style={{ cursor: 'pointer' }}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedVocabs.includes(vocab.vocabId)}
                        onChange={() => toggleVocabSelection(vocab.vocabId)}
                      />
                    </td>
                    <td><strong>{vocab.word}</strong></td>
                    <td>{vocab.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {vocabulary.filter(v => v.topicId === quickCreateTopicId).length === 0 && (
              <Alert variant="warning" className="rounded-3">Chủ đề này chưa có từ vựng</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuickCreate(false)}>Hủy</Button>
            <Button 
              onClick={handleQuickCreateSubmit}
              disabled={selectedVocabs.length === 0}
              style={{ backgroundColor: primaryColor, border: 'none' }}
            >
              Tạo {selectedVocabs.length} câu hỏi
            </Button>
          </Modal.Footer>
        </Modal>
    </AdminLayout>
  );
};

export default AdminTests;
