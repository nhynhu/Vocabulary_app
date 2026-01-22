import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './component/header/Header';
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
import ForgotPassword from './component/account/ForgotPassword';
import VerifyEmail from './component/account/VerifyEmail';
import ResetPassword from './component/account/ResetPassword';
import Profile from './component/account/Profile';
// Admin pages
import AdminDashboard from './component/admin/AdminDashboard';
import AdminUsers from './component/admin/AdminUsers';
import AdminLessons from './component/admin/AdminLessons';
import AdminTests from './component/admin/AdminTests';
import { AuthProvider } from './contexts/AuthContext';

const AppLayout = () => {
  const location = useLocation(); // SỬA LỖI: Sử dụng useLocation hook

  // Danh sách các route không cần header và sidebar
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const adminRoutes = ['/admin', '/admin/users', '/admin/lessons', '/admin/tests'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isAdminRoute = adminRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Chỉ hiển thị header khi không phải auth routes hoặc admin routes */}
      {!isAuthRoute && !isAdminRoute && <Header />}

      <main className={`flex-1 ${isAuthRoute ? 'w-full min-h-screen pt-0' : isAdminRoute ? 'pt-0' : 'pt-16'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
          <Route path="/profile" element={<Profile />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/lessons" element={<AdminLessons />} />
          <Route path="/admin/tests" element={<AdminTests />} />
        </Routes>
      </main>
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
