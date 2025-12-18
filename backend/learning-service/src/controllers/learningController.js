const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

// NỘP BÀI TEST & CHẤM ĐIỂM
exports.submitTest = async (req, res) => {
    const { userId } = req.user;
    const { testId, answers, flaggedQuestions } = req.body;
    // answers = [{ questionId: 1, userAnswer: "A" }]

    // 1. Gọi Content Service lấy đáp án đúng
    const contentRes = await axios.get(`http://localhost:3002/internal/tests/${testId}`);
    const questions = contentRes.data.questions;

    let score = 0;
    let wrongVocabIds = [];
    const pointPerQ = 100 / questions.length;

    // 2. So khớp đáp án
    questions.forEach(q => {
        const userAns = answers.find(a => a.questionId === q.id);
        if (userAns?.userAnswer === q.correctAnswer) {
            score += pointPerQ;
        } else {
            // Logic: Nếu sai -> Tìm Vocab ID liên quan để lưu vào danh sách "Hay sai"
            if (q.relatedVocabId) wrongVocabIds.push(q.relatedVocabId);
        }
    });

    // 3. Cập nhật DB: Tăng errorCount cho từ sai
    for (const vId of wrongVocabIds) {
        await prisma.userVocabulary.upsert({
            where: { userId_vocabId: { userId, vocabId: vId } },
            update: { errorCount: { increment: 1 } },
            create: { userId, vocabId: vId, errorCount: 1 }
        });
    }

    // 4. Lưu lịch sử thi (kèm câu hỏi gắn cờ để xem lại)
    await prisma.testAttempt.create({
        data: { userId, testId, score: Math.round(score), flaggedQuestions }
    });

    res.json({ score, message: "Done" });
};

// PROFILE USER
exports.getProfile = async (req, res) => {
    const { userId, name } = req.user; // Lấy từ token

    // Đếm số liệu
    const testsCount = await prisma.testAttempt.count({ where: { userId } });
    const topicsCount = await prisma.userTopicProgress.count({
        where: { userId, isCompleted: true }
    });

    res.json({
        userId, name,
        stats: { testsTaken: testsCount, lessonsLearned: topicsCount }
    });
};

// LẤY DANH SÁCH TỪ HỌC LẠI (Hay sai + Đánh dấu)
exports.getReviewWords = async (req, res) => {
    const { userId } = req.user;

    // Tìm các từ có errorCount > 2 hoặc isMarked = true
    const list = await prisma.userVocabulary.findMany({
        where: { userId, OR: [{ errorCount: { gt: 2 } }, { isMarked: true }] }
    });

    // Gọi Content Service để lấy chi tiết Word, Audio, Image
    const vocabIds = list.map(i => i.vocabId);
    const details = await axios.post('http://localhost:3002/internal/vocabs', { ids: vocabIds });

    res.json(details.data);
};
exports.getProfileStats = async (req, res) => {
    try {
        // Lấy userId từ token (do middleware auth giải mã)
        const userId = req.user.id;

        // 1. Đếm số từ vựng đã học (có trong bảng UserVocabulary)
        const wordsLearned = await prisma.userVocabulary.count({
            where: { userId: userId }
        });

        // 2. Đếm số chủ đề đã hoàn thành
        const completedTopics = await prisma.userTopicProgress.count({
            where: {
                userId: userId,
                isCompleted: true
            }
        });

        // 3. Tính điểm trung bình bài test
        const testAttempts = await prisma.testAttempt.findMany({
            where: { userId: userId }
        });

        let avgScore = 0;
        if (testAttempts.length > 0) {
            const totalScore = testAttempts.reduce((sum, test) => sum + test.score, 0);
            avgScore = Math.round(totalScore / testAttempts.length);
        }

        // Trả về dữ liệu
        res.json({
            wordsLearned,
            completedTopics,
            avgScore,
            streak: 0 // Tạm thời để 0 (logic streak cần bảng riêng phức tạp hơn)
        });

    } catch (err) {
        console.error("Lỗi lấy stats:", err);
        res.status(500).json({ message: err.message });
    }
};