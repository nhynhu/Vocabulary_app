import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Badge, Card, Row, Col, InputGroup } from 'react-bootstrap';
import ApiService from '../../services/api';
import AdminLayout from './AdminLayout';

// Màu chủ đạo
const primaryColor = '#0f3057';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto hide alerts
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.userId?.toString().includes(searchTerm);
    const matchRole = !filterRole || user.role === filterRole;
    return matchSearch && matchRole;
  });

  // Statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    users: users.filter(u => u.role === 'USER').length
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        fullName: user.fullName || '',
        role: user.role || 'USER'
      });
    } else {
      setEditingUser(null);
      setFormData({ email: '', password: '', fullName: '', role: 'USER' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', fullName: '', role: 'USER' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await ApiService.updateAdminUser(editingUser.userId, updateData);
        setSuccess('Cập nhật người dùng thành công!');
      } else {
        await ApiService.createAdminUser(formData);
        setSuccess('Thêm người dùng thành công!');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await ApiService.deleteAdminUser(id);
        setSuccess('Xóa người dùng thành công!');
        fetchUsers();
      } catch (error) {
        setError('Không thể xóa người dùng');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý Người dùng" subtitle="Quản lý tài khoản người dùng trong hệ thống">
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
    <AdminLayout title="Quản lý Người dùng" subtitle="Quản lý tài khoản người dùng trong hệ thống">
      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3 mb-3">
          {error}
        </Alert>
      )}

      {/* Action Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button 
          className="rounded-pill"
          style={{ backgroundColor: primaryColor, border: 'none' }}
          onClick={() => handleShowModal()}
        >
          + Thêm người dùng
        </Button>
      </div>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ borderLeft: `4px solid ${primaryColor}` }}>
            <Card.Body className="text-center py-4">
              <h2 style={{ color: primaryColor, fontWeight: 'bold' }}>{stats.total}</h2>
              <span className="text-muted small">Tổng người dùng</span>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ borderLeft: '4px solid #dc3545' }}>
            <Card.Body className="text-center py-4">
              <h2 style={{ color: '#dc3545', fontWeight: 'bold' }}>{stats.admins}</h2>
              <span className="text-muted small">Quản trị viên</span>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ borderLeft: '4px solid #28a745' }}>
            <Card.Body className="text-center py-4">
              <h2 style={{ color: '#28a745', fontWeight: 'bold' }}>{stats.users}</h2>
              <span className="text-muted small">Người dùng thường</span>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Card className="border-0 shadow-sm rounded-3 mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo email, họ tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">-- Tất cả vai trò --</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => { setSearchTerm(''); setFilterRole(''); }}
              >
                  Xóa bộ lọc
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Header style={{ backgroundColor: primaryColor }} className="text-white rounded-top">
            <h5 className="mb-0">Danh sách người dùng ({filteredUsers.length})</h5>
          </Card.Header>
          <Card.Body>
            {filteredUsers.length === 0 ? (
              <Alert variant="info" className="rounded-3 mb-0">
                Không tìm thấy người dùng nào
              </Alert>
            ) : (
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Họ tên</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.userId}>
                      <td>
                        <Badge bg="secondary">#{user.userId}</Badge>
                      </td>
                      <td>
                        <span style={{ color: primaryColor, fontWeight: 500 }}>{user.email}</span>
                      </td>
                      <td>{user.fullName || <span className="text-muted">Chưa cập nhật</span>}</td>
                      <td>
                        <Badge bg={user.role === 'ADMIN' ? 'danger' : 'success'}>
                          {user.role === 'ADMIN' ? 'Admin' : 'User'}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleShowModal(user)}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(user.userId)}
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

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton style={{ backgroundColor: primaryColor }} className="text-white">
            <Modal.Title>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Mật khẩu {editingUser ? '(để trống nếu không đổi)' : <span className="text-danger">*</span>}
                </Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  required={!editingUser}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">User - Người dùng thường</option>
                  <option value="ADMIN">Admin - Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button 
                type="submit"
                style={{ backgroundColor: primaryColor, border: 'none' }}
              >
                {editingUser ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;
