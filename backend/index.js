require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const learningRoutes = require('./src/routes/learningRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files cho uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - giữ nguyên path như API Gateway cũ để frontend không cần thay đổi
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/api/learning', learningRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'English App Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 English App Backend running on port ${PORT}`);
    console.log(`📚 Auth API: http://localhost:${PORT}/auth`);
    console.log(`📖 Content API: http://localhost:${PORT}/content`);
    console.log(`🎓 Learning API: http://localhost:${PORT}/api/learning`);
});
