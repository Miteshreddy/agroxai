require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Database connection
require('./db'); // ensures mongoose connects

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
const recommendRouter = require('./routes/recommend');
const riskRouter = require('./routes/risk');
const soilRouter = require('./routes/soil');
const improvementRouter = require('./routes/improvement');
const revenueRouter = require('./routes/revenue');
const feasibilityRouter = require('./routes/feasibility');
const schemesRouter = require('./routes/schemes');
const labourRouter = require('./routes/labour');
const guideRouter = require('./routes/guide');
const organicRouter = require('./routes/organic');
const authRouter = require('./routes/auth');
const weatherRouter = require('./routes/weather');
const chatRouter = require('./routes/chat');

app.use('/api', recommendRouter);
app.use('/api', riskRouter);
app.use('/api', soilRouter);
app.use('/api', improvementRouter);
app.use('/api', revenueRouter);
app.use('/api', feasibilityRouter);
app.use('/api', schemesRouter);
app.use('/api', labourRouter);
app.use('/api', guideRouter);
app.use('/api', organicRouter);
app.use('/api/auth', authRouter);
app.use('/api', weatherRouter);
app.use('/api', chatRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- Global Server Error ---');
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? 'Service temporarily unavailable' : err.message
    });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
