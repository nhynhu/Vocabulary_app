const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const makeRequest = async (endpoint, method = 'GET', body = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        console.log(`🌐 API ${method} Request:`, url, body ? { body } : '');

        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
            },
            signal: controller.signal
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            let errorData = { message: `Request failed with status ${response.status}` };
            if (contentType && contentType.indexOf("application/json") !== -1) {
                errorData = await response.json();
            }
            throw new Error(errorData.message || errorData.error || `An unexpected error occurred.`);
        }

        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return {};
        }

        return await response.json();

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('❌ API Request timeout');
            throw new Error('Server is taking too long to respond. This might happen on the first start. Please try again.');
        }

        console.error('❌ API Request Failed:', error.message);
        throw error;
    }
};

const ApiService = {
    // Auth - Backend route: /auth/*
    login: (credentials) => makeRequest('/auth/login', 'POST', credentials),
    register: (userData) => makeRequest('/auth/register', 'POST', userData),

    // Topics - Backend route: /content/topics
    getAllTopics: () => makeRequest('/content/topics'),

    // Vocabulary - Backend route: /content/topics/:topicId/vocabulary
    getVocabularyByTopic: (topicId) => makeRequest(`/content/topics/${topicId}/vocabulary`),

    // Tests - Backend route: /content/topics/:topicId/tests, /content/tests/:id
    getTestsByTopic: (topicId) => {
        if (!topicId || topicId === 'undefined' || topicId === 'null' || String(topicId).trim() === '') {
            console.error('getTestsByTopic called with invalid topicId:', topicId);
            return Promise.reject(new Error('Invalid topicId'));
        }
        return makeRequest(`/content/topics/${topicId}/tests`);
    },
    getTestById: (testId) => {
        if (!testId || testId === 'undefined' || testId === 'null' || String(testId).trim() === '') {
            console.error('getTestById called with invalid testId:', testId);
            return Promise.reject(new Error('Invalid testId'));
        }
        return makeRequest(`/content/tests/${testId}`);
    },

    // Learning - Backend route: /api/learning/*
    submitTest: (submission) => makeRequest('/api/learning/test/submit', 'POST', submission),
    getProfile: () => makeRequest('/api/learning/profile'),
    getProfileStats: () => makeRequest('/api/learning/stats'),
    getReviewWords: () => makeRequest('/api/learning/review'),

    // ==================== ADMIN APIs ====================
    // Stats
    getAdminStats: () => makeRequest('/admin/stats'),

    // Users
    getAdminUsers: () => makeRequest('/admin/users'),
    getAdminUser: (id) => makeRequest(`/admin/users/${id}`),
    createAdminUser: (data) => makeRequest('/admin/users', 'POST', data),
    updateAdminUser: (id, data) => makeRequest(`/admin/users/${id}`, 'PUT', data),
    deleteAdminUser: (id) => makeRequest(`/admin/users/${id}`, 'DELETE'),

    // Topics
    getAdminTopics: () => makeRequest('/admin/topics'),
    createAdminTopic: (data) => makeRequest('/admin/topics', 'POST', data),
    updateAdminTopic: (id, data) => makeRequest(`/admin/topics/${id}`, 'PUT', data),
    deleteAdminTopic: (id) => makeRequest(`/admin/topics/${id}`, 'DELETE'),

    // Vocabulary
    getAdminVocabulary: () => makeRequest('/admin/vocabulary'),
    createAdminVocabulary: (data) => makeRequest('/admin/vocabulary', 'POST', data),
    updateAdminVocabulary: (id, data) => makeRequest(`/admin/vocabulary/${id}`, 'PUT', data),
    deleteAdminVocabulary: (id) => makeRequest(`/admin/vocabulary/${id}`, 'DELETE'),

    // Dictionary API
    lookupDictionary: async (word) => {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        return response.json();
    },

    // Tests
    getAdminTests: () => makeRequest('/admin/tests'),
    createAdminTest: (data) => makeRequest('/admin/tests', 'POST', data),
    updateAdminTest: (id, data) => makeRequest(`/admin/tests/${id}`, 'PUT', data),
    deleteAdminTest: (id) => makeRequest(`/admin/tests/${id}`, 'DELETE'),

    // Questions
    getAdminQuestions: (testId) => makeRequest(`/admin/tests/${testId}/questions`),
    createAdminQuestion: (data) => makeRequest('/admin/questions', 'POST', data),
    updateAdminQuestion: (id, data) => makeRequest(`/admin/questions/${id}`, 'PUT', data),
    deleteAdminQuestion: (id) => makeRequest(`/admin/questions/${id}`, 'DELETE'),
};

export default ApiService;