const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const multer = require('multer');
const path = require('path');

// --- CẤU HÌNH MULTER (Nơi lưu và tên file) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Lưu vào thư mục 'uploads/' nằm ở root của content-service
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Đặt tên file = Thời gian hiện tại + Đuôi file gốc (vd: 17123456.jpg)
        // Để tránh việc upload 2 ảnh cùng tên bị đè lên nhau
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// ---------------------------------------------

// Routes Topic
router.get('/topics', contentController.getTopics);
router.post('/topics', contentController.createTopic);

// Routes Vocabulary
// CHÚ Ý: 'image' trong upload.single('image') là tên field mà Frontend phải gửi đúng
router.post('/vocabulary', upload.single('image'), contentController.createVocabulary);

router.get('/topics/:topicId/vocabulary', contentController.getVocabularyByTopic);
router.put('/vocabulary/:id', upload.single('image'), contentController.updateVocabulary);
router.delete('/vocabulary/:id', contentController.deleteVocabulary);

// Test
router.get('/topics/:topicId/tests', contentController.getTestsByTopic);
router.post('/tests', contentController.createTest);
router.put('/tests/:id', contentController.updateTest);
router.delete('/tests/:id', contentController.deleteTest);
router.put('/topics/:id', contentController.updateTopic);
router.delete('/topics/:id', contentController.deleteTopic);
router.get('/tests/:id', contentController.getTestById);

module.exports = router;