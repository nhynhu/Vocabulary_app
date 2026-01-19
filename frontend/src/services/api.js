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
    getTestsByTopic: (topicId) => makeRequest(`/content/topics/${topicId}/tests`),
    getTestById: (testId) => makeRequest(`/content/tests/${testId}`),

    // Learning - Backend route: /api/learning/*
    submitTest: (submission) => makeRequest('/api/learning/test/submit', 'POST', submission),
    getProfile: () => makeRequest('/api/learning/profile'),
    getProfileStats: () => makeRequest('/api/learning/stats'),
    getReviewWords: () => makeRequest('/api/learning/review'),
};

export default ApiService;