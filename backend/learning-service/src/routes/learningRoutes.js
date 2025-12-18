const express = require('express');
const router = express.Router();
const controller = require('../controllers/learningController');
const authMiddleware = require('../middleware/auth');

// Áp dụng middleware cho TOÀN BỘ router này
router.use(authMiddleware);

router.post('/test/submit', controller.submitTest);
router.get('/profile', controller.getProfile);
router.get('/review', controller.getReviewWords);
router.get('/stats', controller.getProfileStats);

module.exports = router;