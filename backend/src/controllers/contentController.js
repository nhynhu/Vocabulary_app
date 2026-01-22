const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==================== TOPICS ====================
exports.getTopics = async (req, res) => {
    try {
        const topics = await prisma.topic.findMany();
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTopic = async (req, res) => {
    try {
        const { name, imgURL } = req.body;
        const newTopic = await prisma.topic.create({
            data: { name, imgURL }
        });
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, imgURL } = req.body;
        const updated = await prisma.topic.update({
            where: { topicId: parseInt(id) },
            data: { name, imgURL }
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tests = await prisma.test.findMany({ where: { topicId: id } });
        for (const test of tests) {
            await prisma.question.deleteMany({ where: { testId: test.testId } });
        }
        await prisma.test.deleteMany({ where: { topicId: id } });
        await prisma.vocabulary.deleteMany({ where: { topicId: id } });
        await prisma.topic.delete({ where: { topicId: id } });
        res.json({ message: "Đã xóa khóa học thành công" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== VOCABULARY ====================
exports.createVocabulary = async (req, res) => {
    try {
        const { word, meaning, ipa, audioURL, imgURL, exampleSentence, exampleMeaning, topicId } = req.body;

        if (!topicId) {
            return res.status(400).json({ message: "Vui lòng chọn Topic ID" });
        }

        const newVocab = await prisma.vocabulary.create({
            data: {
                word,
                meaning,
                ipa: ipa || null,
                audioURL: audioURL || null,
                imgURL: imgURL || null,
                exampleSentence: exampleSentence || null,
                exampleMeaning: exampleMeaning || null,
                topicId: parseInt(topicId)
            }
        });

        res.status(201).json(newVocab);
    } catch (err) {
        console.error("Lỗi Controller:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getVocabularyByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const vocabularies = await prisma.vocabulary.findMany({
            where: { topicId: parseInt(topicId) }
        });
        res.json(vocabularies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateVocabulary = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, meaning, ipa, exampleSentence, exampleMeaning, audioURL, imgURL } = req.body;

        const updateData = {
            word,
            meaning,
            ipa: ipa || null,
            exampleSentence: exampleSentence || null,
            exampleMeaning: exampleMeaning || null,
            audioURL: audioURL || null,
            imgURL: imgURL || null,
        };

        const updated = await prisma.vocabulary.update({
            where: { vocabId: parseInt(id) },
            data: updateData
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteVocabulary = async (req, res) => {
    try {
        await prisma.vocabulary.delete({ where: { vocabId: parseInt(req.params.id) } });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== TESTS ====================
exports.getTestsByTopic = async (req, res) => {
    try {
        const topicId = parseInt(req.params.topicId);
        if (isNaN(topicId)) {
            return res.status(400).json({ error: 'Invalid topicId' });
        }
        const tests = await prisma.test.findMany({
            where: { topicId },
            include: { questions: true }
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        if (isNaN(testId)) {
            return res.status(400).json({ error: 'Invalid testId' });
        }
        const test = await prisma.test.findUnique({
            where: { testId },
            include: { questions: true }
        });
        if (!test) return res.status(404).json({ message: "Test not found" });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTest = async (req, res) => {
    try {
        const { topicId, maxScore, imgURL, title, timeLimit, questions } = req.body;
        const newTest = await prisma.test.create({
            data: {
                topicId: parseInt(topicId),
                maxScore: maxScore || 100,
                imgURL: imgURL || null,
                title: title || null,
                timeLimit: timeLimit || 120, // Mặc định 2 phút
                questions: questions ? {
                    create: questions.map(q => ({
                        content: q.content,
                        type: q.type || "CHOICE",
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }))
                } : undefined
            },
            include: { questions: true }
        });
        res.status(201).json(newTest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        const { maxScore, imgURL, title, timeLimit, questions } = req.body;

        if (questions) {
            await prisma.question.deleteMany({ where: { testId } });
        }

        const updateData = {};
        if (maxScore !== undefined) updateData.maxScore = maxScore;
        if (imgURL !== undefined) updateData.imgURL = imgURL;
        if (title !== undefined) updateData.title = title;
        if (timeLimit !== undefined) updateData.timeLimit = timeLimit;
        if (questions) {
            updateData.questions = {
                create: questions.map(q => ({
                    content: q.content,
                    type: q.type || "CHOICE",
                    answers: q.answers,
                    correctAnswer: q.correctAnswer
                }))
            };
        }

        const updatedTest = await prisma.test.update({
            where: { testId },
            data: updateData,
            include: { questions: true }
        });
        res.json(updatedTest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        if (isNaN(testId)) {
            return res.status(400).json({ error: 'Invalid testId' });
        }
        await prisma.question.deleteMany({ where: { testId } });
        await prisma.test.delete({ where: { testId } });
        res.json({ message: "Đã xóa bài test thành công" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== INTERNAL APIs (for Learning) ====================
exports.getTestInternal = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        if (isNaN(testId)) {
            return res.status(400).json({ error: 'Invalid testId' });
        }
        const test = await prisma.test.findUnique({
            where: { testId },
            include: { questions: true }
        });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getVocabsByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        const vocabs = await prisma.vocabulary.findMany({
            where: { vocabId: { in: ids } }
        });
        res.json(vocabs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
