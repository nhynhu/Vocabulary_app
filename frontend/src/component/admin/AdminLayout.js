import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, InputGroup } from 'react-bootstrap';
import '../../styles.css';

const primaryColor = '#0f3057';
const sidebarBg = '#0f3057';
const sidebarWidth = '250px';

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { 
      path: '/admin', 
      label: 'Dashboard',
      exact: true 
    },
    { 
      path: '/admin/lessons', 
      label: 'Quản lý Bài học' 
    },
    { 
      path: '/admin/tests', 
      label: 'Quản lý Bài test' 
    },
    { 
      path: '/admin/users', 
      label: 'Quản lý Người dùng' 
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarWidth,
          backgroundColor: sidebarBg,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <h5 className="mb-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            VOCAB ADMIN
          </h5>
          <small style={{ opacity: 0.7, fontSize: '12px' }}>Quản lý hệ thống</small>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '12px 25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  borderLeft: active ? '3px solid #fff' : '3px solid transparent',
                  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.8)',
                  fontWeight: active ? '500' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Button
            variant="outline-light"
            size="sm"
            className="w-100"
            onClick={() => navigate('/')}
          >
            ← Trang chủ
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarWidth, flex: 1, backgroundColor: '#f5f7fa' }}>
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: primaryColor,
            color: 'white',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            gap: '20px'
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <h5 className="mb-0">{title}</h5>
            {subtitle && <small style={{ opacity: 0.9 }}>{subtitle}</small>}
          </div>
          
          {/* Search Bar */}
          <div style={{ flex: '1', maxWidth: '500px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '20px'
                }}
              />
            </InputGroup>
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <span style={{ fontSize: '14px' }}>Admin</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
