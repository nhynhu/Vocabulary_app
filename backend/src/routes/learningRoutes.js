const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const authMiddleware = require('../middleware/auth');

// Áp dụng middleware cho TOÀN BỘ router này
router.use(authMiddleware);

router.post('/test/submit', learningController.submitTest);
router.get('/profile', learningController.getProfile);
router.put('/profile', learningController.updateProfile);
router.get('/review', learningController.getReviewWords);
router.get('/stats', learningController.getProfileStats);

// Topic progress routes
router.get('/topics/:topicId/progress', learningController.getTopicProgress);
router.put('/topics/:topicId/progress', learningController.updateTopicProgress);

module.exports = router;
