// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secret_key_123";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Vui lòng đăng nhập để tiếp tục" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Token không hợp lệ" });
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;