const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const authMiddleware = require('../middleware/auth');

// Áp dụng middleware cho TOÀN BỘ router này
router.use(authMiddleware);

router.post('/test/submit', learningController.submitTest);
router.get('/profile', learningController.getProfile);
router.get('/review', learningController.getReviewWords);
router.get('/stats', learningController.getProfileStats);

module.exports = router;
