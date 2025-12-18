import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LearnPage from './pages/LearnPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import TestsPage from './pages/TestsPage';
import TestDetailPage from './pages/TestDetailPage';
import ManageCourses from './pages/ManageCourses';
import ManageTests from './pages/ManageTests';



function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/topic/:id/learn" element={<LearnPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:id" element={<TestDetailPage />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/tests" element={<ManageTests />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;