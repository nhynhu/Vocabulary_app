const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "secret_key_123";
const GOOGLE_CLIENT_ID = '363735340206-66gn8abl1cacbqj5resrp39ugg67q14t.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    const { email, password, fullName } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { email, password: hash, fullName }
        });
        res.json(user);
    } catch (e) {
        res.status(400).json({ error: "Email exists" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send("Error");
    }

    const token = jwt.sign(
        { userId: user.userId, role: user.role, name: user.fullName },
        SECRET
    );

    res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: user.role || 'user'
        }
    });
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;
        
        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            // Create new user with Google account
            const randomPassword = Math.random().toString(36).slice(-8);
            const hash = await bcrypt.hash(randomPassword, 10);
            
            user = await prisma.user.create({
                data: {
                    email,
                    password: hash,
                    fullName: name,
                    googleId,
                    avatar: picture
                }
            });
        } else if (!user.googleId) {
            // Link Google account to existing user
            user = await prisma.user.update({
                where: { email },
                data: { 
                    googleId,
                    avatar: user.avatar || picture
                }
            });
        }
        
        const token = jwt.sign(
            { userId: user.userId, role: user.role, name: user.fullName },
            SECRET
        );
        
        res.status(200).json({
            message: "Google login successful",
            token: token,
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                role: user.role || 'user',
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ error: "Google authentication failed" });
    }
};
