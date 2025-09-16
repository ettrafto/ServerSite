"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_js_1 = require("../db.js");
const config_js_1 = require("../config.js");
const authRequired_js_1 = require("../middleware/authRequired.js");
const router = (0, express_1.Router)();
// Register endpoint (only enabled in development)
router.post('/register', async (req, res) => {
    if (!config_js_1.config.devAllowRegister) {
        return res.status(403).json({ error: 'Registration is disabled' });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        // Check if user already exists
        const existingUser = await db_js_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        // Create user
        const user = await db_js_1.prisma.user.create({
            data: {
                email,
                passwordHash
            }
        });
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        // Find user
        const user = await db_js_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const isValidPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Set session
        req.session.user = {
            id: user.id,
            email: user.email
        };
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Logout endpoint
router.post('/logout', (req, res) => {
    req.session?.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});
// Get current user
router.get('/me', authRequired_js_1.authRequired, (req, res) => {
    res.json({
        user: req.user
    });
});
exports.default = router;
