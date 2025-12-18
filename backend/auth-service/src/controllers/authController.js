const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const SECRET = "secret_key_123";

exports.register = async (req, res) => {
    const { email, password, fullName } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({ data: { email, password: hash, fullName } });
        res.json(user);
    } catch (e) { res.status(400).json({ error: "Email exists" }); }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).send("Error");

    const token = jwt.sign({ userId: user.id, role: user.role, name: user.fullName }, SECRET);
    res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role || 'user'
        }
    });
};