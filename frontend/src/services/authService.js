import axios from 'axios';

const API_URL = "http://localhost:3000/auth";

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const registerUser = async (fullName, email, password) => {
    const response = await axios.post(`${API_URL}/register`, { fullName, email, password });
    return response.data;
};

// Hàm lấy token từ localStorage
export const getToken = () => localStorage.getItem('token');

// Hàm đăng xuất (Xóa token)
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};