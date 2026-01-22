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

        console.log('=== BACKEND DEBUG ===');
        console.log('Test questions:', questions.length);
        console.log('Received answers:', answers);

        // So khớp đáp án
        questions.forEach(q => {
            const userAns = answers.find(a => a.questionId === q.questionId);
            const isCorrect = userAns?.userAnswer === q.correctAnswer;
            
            console.log(`Question ${q.questionId}:`, {
                userAnswer: userAns?.userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect
            });
            
            if (isCorrect) {
                score += pointPerQ;
            } else {
                if (q.relatedVocabId) wrongVocabIds.push(q.relatedVocabId);
            }
        });

        console.log('Final score:', Math.round(score));

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
                OR: [{ errorCount: { gt: 0 } }, { isMarked: true }]
            }
        });

        const vocabIds = list.map(i => i.vocabId);

        // Lấy chi tiết vocabulary trực tiếp từ database
        const vocabs = await prisma.vocabulary.findMany({
            where: { vocabId: { in: vocabIds } }
        });

        // Kết hợp vocabulary với errorCount
        const reviewWords = vocabs.map(vocab => {
            const userVocab = list.find(uv => uv.vocabId === vocab.vocabId);
            return {
                ...vocab,
                errorCount: userVocab?.errorCount || 0,
                isMarked: userVocab?.isMarked || false
            };
        });

        res.json(reviewWords);
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

// LẤY TIẾN TRÌNH HỌC CỦA USER CHO TOPIC
exports.getTopicProgress = async (req, res) => {
    try {
        const { userId } = req.user;
        const { topicId } = req.params;

        const progress = await prisma.userTopicProgress.findUnique({
            where: {
                userId_topicId: {
                    userId,
                    topicId: parseInt(topicId)
                }
            }
        });

        // Lấy số từ vựng thực tế của topic
        const totalWords = await prisma.vocabulary.count({
            where: { topicId: parseInt(topicId) }
        });

        // Nếu chưa có tiến trình, trả về mặc định
        if (!progress) {
            return res.json({
                completionPercentage: 0,
                isCompleted: false,
                currentWordIndex: 0,
                totalWords
            });
        }

        // Tính current word index từ completionPercentage dựa trên số từ thực tế
        const currentWordIndex = Math.floor((progress.completionPercentage / 100) * totalWords);

        res.json({
            completionPercentage: progress.completionPercentage,
            isCompleted: progress.isCompleted,
            currentWordIndex: Math.min(currentWordIndex, totalWords - 1),
            totalWords
        });
    } catch (err) {
        console.error('Get topic progress error:', err);
        res.status(500).json({ error: err.message });
    }
};

// CẬP NHẬT TIẾN TRÌNH HỌC
exports.updateTopicProgress = async (req, res) => {
    try {
        const { userId } = req.user;
        const { topicId } = req.params;
        const { currentWordIndex, totalWords } = req.body;

        // Tính completionPercentage từ currentWordIndex
        // currentWordIndex là số từ đã học (0-based index)
        const completionPercentage = Math.round(((currentWordIndex + 1) / totalWords) * 100);
        const isCompleted = completionPercentage >= 100;

        const progress = await prisma.userTopicProgress.upsert({
            where: {
                userId_topicId: {
                    userId,
                    topicId: parseInt(topicId)
                }
            },
            update: {
                completionPercentage: Math.min(completionPercentage, 100),
                isCompleted,
                updatedAt: new Date()
            },
            create: {
                userId,
                topicId: parseInt(topicId),
                completionPercentage: Math.min(completionPercentage, 100),
                isCompleted
            }
        });

        res.json({
            success: true,
            progress
        });
    } catch (err) {
        console.error('Update topic progress error:', err);
        res.status(500).json({ error: err.message });
    }
};

// CẬP NHẬT THÔNG TIN PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { fullName, currentPassword, newPassword } = req.body;

        // Lấy thông tin user hiện tại
        const user = await prisma.user.findUnique({
            where: { userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Chuẩn bị dữ liệu update
        const updateData = {};

        // Cập nhật tên nếu có
        if (fullName && fullName !== user.fullName) {
            updateData.fullName = fullName;
        }

        // Cập nhật mật khẩu nếu có
        if (currentPassword && newPassword) {
            // Kiểm tra mật khẩu cũ
            if (!user.password) {
                return res.status(400).json({ error: 'Cannot change password for Google accounts' });
            }

            const bcrypt = require('bcryptjs');
            const isValid = await bcrypt.compare(currentPassword, user.password);
            
            if (!isValid) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        // Nếu không có gì để update
        if (Object.keys(updateData).length === 0) {
            return res.json({
                success: true,
                message: 'No changes to update'
            });
        }

        // Cập nhật database
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: updateData,
            select: {
                userId: true,
                email: true,
                fullName: true,
                avatar: true
            }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: err.message });
    }
};
