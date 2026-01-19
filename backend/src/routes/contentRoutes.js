const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const multer = require('multer');
const path = require('path');

// --- CẤU HÌNH MULTER (Nơi lưu và tên file) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes Topic
router.get('/topics', contentController.getTopics);
router.post('/topics', contentController.createTopic);
router.put('/topics/:id', contentController.updateTopic);
router.delete('/topics/:id', contentController.deleteTopic);

// Routes Vocabulary
router.post('/vocabulary', upload.single('image'), contentController.createVocabulary);
router.get('/topics/:topicId/vocabulary', contentController.getVocabularyByTopic);
router.put('/vocabulary/:id', upload.single('image'), contentController.updateVocabulary);
router.delete('/vocabulary/:id', contentController.deleteVocabulary);

// Routes Test
router.get('/topics/:topicId/tests', contentController.getTestsByTopic);
router.get('/tests/:id', contentController.getTestById);
router.post('/tests', contentController.createTest);
router.put('/tests/:id', contentController.updateTest);
router.delete('/tests/:id', contentController.deleteTest);

// Internal APIs (for learning service - now direct)
router.get('/internal/tests/:id', contentController.getTestInternal);
router.post('/internal/vocabs', contentController.getVocabsByIds);

module.exports = router;
