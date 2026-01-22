require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const learningRoutes = require('./src/routes/learningRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Static files cho uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - giữ nguyên path như API Gateway cũ để frontend không cần thay đổi
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/api/learning', learningRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'English App Backend is running' });
});

// Database health check
app.get('/db/health', async (req, res) => {
    try {
        // Simple query to validate connection
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'OK', message: 'Database connection successful' });
    } catch (err) {
        console.error('Database health check failed:', err.message);
        res.status(500).json({ status: 'ERROR', message: err.message });
    }
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
    // Try connecting to the database on startup for early feedback
    prisma.$connect()
        .then(() => console.log('✅ Connected to database'))
        .catch(err => console.error('❌ Failed to connect to database:', err.message));
});
