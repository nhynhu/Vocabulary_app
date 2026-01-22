const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ==================== USER MANAGEMENT ====================
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                userId: true,
                email: true,
                fullName: true,
                role: true,
                avt: true
            }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId: parseInt(req.params.id) },
            select: {
                userId: true,
                email: true,
                fullName: true,
                role: true,
                avt: true
            }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, fullName, role, avt } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hash, fullName, role: role || 'USER', avt }
        });
        res.status(201).json({
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            avt: user.avt
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, fullName, role, password, avt } = req.body;
        const updateData = { email, fullName, role, avt };
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const user = await prisma.user.update({
            where: { userId: parseInt(req.params.id) },
            data: updateData
        });
        res.json({
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            avt: user.avt
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        
        // Delete related data first
        await prisma.testAttempt.deleteMany({ where: { userId } });
        await prisma.userTopicProgress.deleteMany({ where: { userId } });
        await prisma.userVocabulary.deleteMany({ where: { userId } });
        
        await prisma.user.delete({ where: { userId } });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== STATISTICS ====================
exports.getStats = async (req, res) => {
    try {
        const usersCount = await prisma.user.count();
        const topicsCount = await prisma.topic.count();
        const vocabularyCount = await prisma.vocabulary.count();
        const testsCount = await prisma.test.count();
        const questionsCount = await prisma.question.count();
        
        res.json({
            users: usersCount,
            topics: topicsCount,
            vocabulary: vocabularyCount,
            tests: testsCount,
            questions: questionsCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== TOPIC MANAGEMENT ====================
exports.getAllTopicsWithDetails = async (req, res) => {
    try {
        const topics = await prisma.topic.findMany({
            include: {
                vocabularies: true,
                tests: {
                    include: { questions: true }
                }
            }
        });
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== VOCABULARY MANAGEMENT ====================
exports.getAllVocabulary = async (req, res) => {
    try {
        const vocabulary = await prisma.vocabulary.findMany({
            include: { topic: true }
        });
        res.json(vocabulary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== TEST MANAGEMENT ====================
exports.getAllTests = async (req, res) => {
    try {
        const tests = await prisma.test.findMany({
            include: {
                topic: true,
                questions: true
            }
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestionsByTest = async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            where: { testId: parseInt(req.params.testId) }
        });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { content, type, answers, correctAnswer, difficulty, relatedVocabId, testId } = req.body;
        const question = await prisma.question.create({
            data: {
                content,
                type: type || 'MULTIPLE_CHOICE',
                answers,
                correctAnswer,
                difficulty: difficulty || 1,
                relatedVocabId,
                testId: parseInt(testId)
            }
        });
        res.status(201).json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { content, type, answers, correctAnswer, difficulty, relatedVocabId } = req.body;
        const question = await prisma.question.update({
            where: { questionId: parseInt(req.params.id) },
            data: { content, type, answers, correctAnswer, difficulty, relatedVocabId }
        });
        res.json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        await prisma.question.delete({ where: { questionId: parseInt(req.params.id) } });
        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
