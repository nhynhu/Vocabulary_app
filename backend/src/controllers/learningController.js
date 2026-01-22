const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import content controller for internal API calls
const contentController = require('./contentController');

// NỘP BÀI TEST & CHẤM ĐIỂM
exports.submitTest = async (req, res) => {
    try {
        const { userId } = req.user;
        const { testId, answers, flaggedQuestions } = req.body;

        // Lấy test trực tiếp từ database (không cần gọi HTTP)
        const test = await prisma.test.findUnique({
            where: { testId: parseInt(testId) },
            include: { questions: true }
        });

        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        const questions = test.questions;
        let score = 0;
        let wrongVocabIds = [];
        const pointPerQ = 100 / questions.length;

        // So khớp đáp án
        questions.forEach(q => {
            const userAns = answers.find(a => a.questionId === q.questionId);
            if (userAns?.userAnswer === q.correctAnswer) {
                score += pointPerQ;
            } else {
                if (q.relatedVocabId) wrongVocabIds.push(q.relatedVocabId);
            }
        });

        // Cập nhật DB: Tăng errorCount cho từ sai
        for (const vId of wrongVocabIds) {
            await prisma.userVocabulary.upsert({
                where: { userId_vocabId: { userId, vocabId: vId } },
                update: { errorCount: { increment: 1 } },
                create: { userId, vocabId: vId, errorCount: 1 }
            });
        }

        // Lưu lịch sử thi
        await prisma.testAttempt.create({
            data: {
                userId,
                testId: parseInt(testId),
                score: Math.round(score),
                details: flaggedQuestions
            }
        });

        res.json({ score: Math.round(score), message: "Done" });
    } catch (err) {
        console.error("Submit test error:", err);
        res.status(500).json({ error: err.message });
    }
};

// PROFILE USER
exports.getProfile = async (req, res) => {
    try {
        const { userId, name } = req.user;

        const testsCount = await prisma.testAttempt.count({ where: { userId } });
        const topicsCount = await prisma.userTopicProgress.count({
            where: { userId, isCompleted: true }
        });

        res.json({
            userId,
            name,
            stats: { testsTaken: testsCount, lessonsLearned: topicsCount }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LẤY DANH SÁCH TỪ HỌC LẠI (Hay sai + Đánh dấu)
exports.getReviewWords = async (req, res) => {
    try {
        const { userId } = req.user;

        const list = await prisma.userVocabulary.findMany({
            where: {
                userId,
                OR: [{ errorCount: { gt: 2 } }, { isMarked: true }]
            }
        });

        const vocabIds = list.map(i => i.vocabId);

        // Lấy chi tiết vocabulary trực tiếp từ database
        const vocabs = await prisma.vocabulary.findMany({
            where: { vocabId: { in: vocabIds } }
        });

        res.json(vocabs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfileStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wordsLearned = await prisma.userVocabulary.count({
            where: { userId: userId }
        });

        const completedTopics = await prisma.userTopicProgress.count({
            where: {
                userId: userId,
                isCompleted: true
            }
        });

        const testAttempts = await prisma.testAttempt.findMany({
            where: { userId: userId }
        });

        let avgScore = 0;
        if (testAttempts.length > 0) {
            const totalScore = testAttempts.reduce((sum, test) => sum + test.score, 0);
            avgScore = Math.round(totalScore / testAttempts.length);
        }

        res.json({
            wordsLearned,
            completedTopics,
            avgScore,
            streak: 0
        });
    } catch (err) {
        console.error("Lỗi lấy stats:", err);
        res.status(500).json({ message: err.message });
    }
};
