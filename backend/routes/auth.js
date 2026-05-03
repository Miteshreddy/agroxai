const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error('Register error:', err);
        const errorMsg = err.message.includes('buffering timed out') 
            ? "Database connection failed. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0"
            : "Registration failed";
        res.status(500).json({ message: errorMsg, error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token,
            user: { id: user._id, username: user.username },
            message: "Login successful"
        });
    } catch (err) {
        console.error('Login error:', err);
        const errorMsg = err.message.includes('buffering timed out') 
            ? "Database connection failed. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0"
            : "Login failed";
        res.status(500).json({ message: errorMsg });
    }
});

module.exports = router;
