import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // SỬA LỖI: Thêm useLocation
import Header from './component/header/Header';
// import HomeMenu from './component/home/HomeMenu';
import HomePage from './component/home/HomePage';
import Topic from './component/learn/Topic';
import Lesson from './component/learn/Lesson';
import Flashcard from './component/learn/Flashcard';
import Test from './component/test/Test';
import TestList from './component/test/TestList';
import TestStart from './component/test/TestStart';
import SearchPage from './component/search/SearchPage';
import Login from './component/account/Login';
import Signup from './component/account/Signup';
import ForgotPassword from './component/account/ForgotPassword'; // Nhập ForgotPassword component
import VerifyEmail from './component/account/VerifyEmail';
import ResetPassword from './component/account/ResetPassword';
import { AuthProvider } from './contexts/AuthContext';

const AppLayout = () => {
  const location = useLocation(); // SỬA LỖI: Sử dụng useLocation hook

  // Danh sách các route không cần header và sidebar
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Chỉ hiển thị header khi không phải auth routes */}
      {!isAuthRoute && (
        <div className="header-container">
          <Header />
        </div>
      )}

      <div className="main-container" style={{ display: 'flex' }}>
        {/* Chỉ hiển thị sidebar khi không phải auth routes */}
        {/* HomeMenu removed as per request */}

        {/* Content container - full width cho auth routes */}
        <div
          className="conten-container"
          style={{
            flex: 1,
            ...(isAuthRoute && { width: '100%', minHeight: '100vh' })
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Đường dẫn mới cho ForgotPassword */}
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/topics" element={<Topic />} />
            <Route path="/learn" element={<Topic />} />
            <Route path="/lessons" element={<Lesson />} />
            <Route path="/flashcard" element={<Flashcard />} />
            <Route path="/test" element={<Test />} />
            <Route path="/tests" element={<Test />} />
            <Route path="/test-list" element={<TestList />} />
            <Route path="/test-start" element={<TestStart />} />
            <Route path="/dotests" element={<TestStart />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
