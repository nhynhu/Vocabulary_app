import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import AdminLayout from './AdminLayout';

// Màu chủ đạo
const primaryColor = '#0f3057';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ApiService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    { key: 'users', label: 'Người dùng', value: stats?.users || 0, color: primaryColor },
    { key: 'topics', label: 'Chủ đề', value: stats?.topics || 0, color: primaryColor },
    { key: 'vocabulary', label: 'Từ vựng', value: stats?.vocabulary || 0, color: primaryColor },
    { key: 'tests', label: 'Bài kiểm tra', value: stats?.tests || 0, color: primaryColor },
    { key: 'questions', label: 'Câu hỏi', value: stats?.questions || 0, color: primaryColor },
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Trang quản trị hệ thống">
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
    <AdminLayout title="Dashboard" subtitle={`Xin chào, ${user?.fullName || 'Admin'}`}>
      {/* Statistics */}
      <h5 className="mb-3 fw-bold" style={{ color: primaryColor }}>Thống kê hệ thống</h5>
      <Row className="mb-4 g-3">
        {statCardsData.map((stat, index) => {
          const colors = ['#0f3057', '#28a745', '#17a2b8', '#ffc107', '#dc3545'];
          const borderColor = colors[index % colors.length];
          return (
            <Col key={stat.key} lg md={6} xs={6}>
              <Card className="h-100 border-0 shadow-sm rounded-3" style={{ borderLeft: `4px solid ${borderColor}` }}>
                <Card.Body className="text-center py-4">
                  <h2 className="mb-1 fw-bold" style={{ color: borderColor }}>{stat.value}</h2>
                  <span className="text-muted small">{stat.label}</span>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
