const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Middleware kiểm tra quyền admin
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Statistics
router.get('/stats', adminController.getStats);

// ==================== USER MANAGEMENT ====================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ==================== TOPIC MANAGEMENT ====================
router.get('/topics', adminController.getAllTopicsWithDetails);
router.post('/topics', contentController.createTopic);
router.put('/topics/:id', contentController.updateTopic);
router.delete('/topics/:id', contentController.deleteTopic);

// ==================== VOCABULARY MANAGEMENT ====================
router.get('/vocabulary', adminController.getAllVocabulary);
router.post('/vocabulary', contentController.createVocabulary);
router.put('/vocabulary/:id', contentController.updateVocabulary);
router.delete('/vocabulary/:id', contentController.deleteVocabulary);

// ==================== TEST MANAGEMENT ====================
router.get('/tests', adminController.getAllTests);
router.post('/tests', contentController.createTest);
router.put('/tests/:id', contentController.updateTest);
router.delete('/tests/:id', contentController.deleteTest);

// ==================== QUESTION MANAGEMENT ====================
router.get('/tests/:testId/questions', adminController.getQuestionsByTest);
router.post('/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

module.exports = router;
