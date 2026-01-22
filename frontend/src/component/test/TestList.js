import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TestCard from './TestCard';
import ApiService from '../../services/api';

const TestList = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const topicId = searchParams.get('topicId');

    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!topicId) {
            setError('Không tìm thấy chủ đề');
            setLoading(false);
            return;
        }

        const fetchTests = async () => {
            try {
                setLoading(true);
                // Backend trả về Test với: id, topicId, maxScore, questions[]
                const data = await ApiService.getTestsByTopic(topicId);
                setTests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching tests:', error);
                setError('Không thể tải danh sách bài test. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [topicId]);

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3">Đang tải bài test...</p>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Lỗi</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-primary" onClick={() => navigate('/test')}>
                        Quay về danh sách chủ đề
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Danh sách bài test</h2>
                    <p className="text-muted">Có {tests.length} bài test trong chủ đề này</p>
                </div>
                <Button variant="outline-secondary" onClick={() => navigate('/test')}>
                    Chọn chủ đề khác
                </Button>
            </div>

            <Row>
                {tests.length > 0 ? (
                    tests.map((test, index) => (
                        <Col key={test.testId} lg={4} md={6} sm={12} className="mb-4">
                            <TestCard
                                title={test.title}
                                img={test.imgURL || "/image/testchoose.jpg"}
                                text={`${test.questions?.length || 0} câu hỏi - Điểm tối đa: ${test.maxScore || 100}`}
                                link={`/test-start?testId=${test.testId}`}
                            />
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <Alert variant="info" className="text-center">
                            <h5>Chưa có bài test nào</h5>
                            <p>Chủ đề này chưa có bài test. Vui lòng quay lại sau.</p>
                            <Button variant="primary" onClick={() => navigate('/test')}>
                                Chọn chủ đề khác
                            </Button>
                        </Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default TestList;
