const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');
const { success, error: errorRes } = require('../utils/response');

// POST /api/history/save - Automatically save recommendation
router.post('/history/save', async (req, res) => {
    try {
        const {
            userId, farmId, farmName, location, coordinates, soilType,
            soilMetrics, environmentalData, predictionResult, metadata
        } = req.body;

        const recommendation = new Recommendation({
            userId: userId || 'guest',
            farmId,
            farmName,
            location,
            coordinates,
            soilType,
            soilMetrics,
            environmentalData,
            predictionResult,
            metadata
        });

        const saved = await recommendation.save();
        return success(res, saved, 'Analysis history saved successfully');
    } catch (err) {
        console.error('Error saving history:', err.message);
        return errorRes(res, 'Failed to save analysis history', 500, err.message);
    }
});

// GET /api/history/user/:userId - Fetch all user history
router.get('/history/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Recommendation.find({ userId }).sort({ createdAt: -1 });
        return success(res, history, 'User history fetched successfully');
    } catch (err) {
        console.error('Error fetching user history:', err.message);
        return errorRes(res, 'Failed to fetch user history', 500, err.message);
    }
});

// GET /api/history/farm/:farmId - Fetch history for specific farm
router.get('/history/farm/:farmId', async (req, res) => {
    try {
        const { farmId } = req.params;
        const history = await Recommendation.find({ farmId }).sort({ createdAt: -1 });
        return success(res, history, 'Farm history fetched successfully');
    } catch (err) {
        console.error('Error fetching farm history:', err.message);
        return errorRes(res, 'Failed to fetch farm history', 500, err.message);
    }
});

// GET /api/history - Fetch all history (fallback for older frontend code)
router.get('/history', async (req, res) => {
    try {
        const history = await Recommendation.find().sort({ createdAt: -1 });
        // Return directly since history page expects array directly or response.data
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err.message);
        res.status(500).json({ error: 'Failed to fetch recommendation history' });
    }
});

// GET /api/history/:id - Get single analysis details
router.get('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Recommendation.findById(id);
        if (!record) return errorRes(res, 'History record not found', 404);
        return success(res, record, 'History record fetched successfully');
    } catch (err) {
        console.error('Error fetching single history:', err.message);
        return errorRes(res, 'Failed to fetch history record', 500, err.message);
    }
});

// DELETE /api/history/:id - Delete history entry
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Recommendation.findByIdAndDelete(id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting recommendation:', err.message);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

module.exports = router;
