const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTopics = async (req, res) => {
    try {
        const topics = await prisma.topic.findMany();
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updated = await prisma.topic.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.createTopic = async (req, res) => {
    try {
        const { name } = req.body;
        const newTopic = await prisma.topic.create({
            data: { name }
        });
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createVocabulary = async (req, res) => {
    try {
        const { word, meaning, ipa, audioUrl, exampleSentence, topicId } = req.body; l
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!topicId) {
            return res.status(400).json({ message: "Vui lòng chọn Topic ID" });
        }

        const newVocab = await prisma.vocabulary.create({
            data: {
                word,
                meaning,
                ipa,
                audioUrl,
                imageUrl,
                exampleSentence,
                topicId: parseInt(topicId)
            }
        });

        res.status(201).json(newVocab);
    } catch (err) {
        console.error("Lỗi Controller:", err);
        res.status(400).json({ error: err.message });
    }
};
exports.deleteTopic = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tests = await prisma.test.findMany({ where: { topicId: id } });
        for (const test of tests) {
            await prisma.question.deleteMany({ where: { testId: test.id } });
        }
        await prisma.test.deleteMany({ where: { topicId: id } });
        await prisma.vocabulary.deleteMany({ where: { topicId: id } });
        await prisma.topic.delete({ where: { id } });
        res.json({ message: "Đã xóa khóa học thành công" });
    } catch (err) { res.status(400).json({ error: err.message }); }
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
        const { word, meaning, ipa, exampleSentence, exampleMeaning, audioUrl } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updated = await prisma.vocabulary.update({
            where: { id: parseInt(id) },
            data: {
                word, meaning, ipa, exampleSentence, exampleMeaning, audioUrl,
                ...(imageUrl && { imageUrl })
            }
        });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteVocabulary = async (req, res) => {
    try {
        await prisma.vocabulary.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: "Deleted" });
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getTestsByTopic = async (req, res) => {
    try {
        const tests = await prisma.test.findMany({
            where: { topicId: parseInt(req.params.topicId) },
            include: { questions: true }
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTest = async (req, res) => {
    try {
        const { topicId, questions } = req.body;
        const newTest = await prisma.test.create({
            data: {
                topicId: parseInt(topicId),
                maxScore: 100,
                questions: {
                    create: questions.map(q => ({
                        content: q.content,
                        type: "multiple-choice",
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }))
                }
            },
            include: { questions: true }
        });
        res.status(201).json(newTest);
    } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.updateTest = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        const { questions } = req.body;


        await prisma.question.deleteMany({ where: { testId } });

        const updatedTest = await prisma.test.update({
            where: { id: testId },
            data: {
                questions: {
                    create: questions.map(q => ({
                        content: q.content,
                        type: "multiple-choice",
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }))
                }
            },
            include: { questions: true }
        });
        res.json(updatedTest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateTest = async (req, res) => {
    try {
        const testId = parseInt(req.params.id);
        const { questions } = req.body;
        await prisma.question.deleteMany({ where: { testId } });

        const updatedTest = await prisma.test.update({
            where: { id: testId },
            data: {
                questions: {
                    create: questions.map(q => ({
                        content: q.content,
                        type: "multiple-choice",
                        answers: q.answers,
                        correctAnswer: q.correctAnswer
                    }))
                }
            },
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
        await prisma.question.deleteMany({ where: { testId } });
        await prisma.test.delete({ where: { id: testId } });
        res.json({ message: "Đã xóa bài test thành công" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getTestById = async (req, res) => {
    try {
        const test = await prisma.test.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { questions: true }
        });
        if (!test) return res.status(404).json({ message: "Test not found" });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};