import React from 'react'
import ReactDOM from 'react-dom/client' // Thêm dòng này
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // Thêm dòng này
import { AuthProvider } from './context/AuthContext' // Đảm bảo có AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Phải có cái này để dùng được Link và useNavigate */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)