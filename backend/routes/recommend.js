const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recommendation = require('../models/Recommendation');
require('dotenv').config();

const flaskUrl = process.env.FLASK_URL || 'http://localhost:5001';

// POST /api/recommend
router.post('/recommend', async (req, res) => {
    try {
        const { location, soil_mode = 'manual', manual_soil_type = 'Loamy' } = req.body;

        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        const baseUrl = 'http://localhost:5005/api';
        const flaskUrlLocal = process.env.FLASK_URL || 'http://localhost:5001';

        // Step 1: Get coordinates (handle both lat/lon and latitude/longitude naming)
        let lat = location.lat || location.latitude;
        let lon = location.lon || location.longitude;
        if (!lat || !lon) {
            const { state, district, village } = location;
            if (!state && !district) {
                return res.status(400).json({ error: 'State or district required for manual location' });
            }
            const geoRes = await axios.get(`${baseUrl}/geocode`, { params: { state, district, village } });
            lat = geoRes.data.latitude;
            lon = geoRes.data.longitude;
        }

        // Step 2: Get weather
        const weatherRes = await axios.get(`${baseUrl}/weather`, { params: { lat, lon } });
        const weather = weatherRes.data;

        // Step 3: Derive descriptive levels from numeric weather
        const rainfall_level = weather.rainfall < 70 ? 'Low' : weather.rainfall < 170 ? 'Medium' : 'High';
        const humidity_level = weather.humidity < 35 ? 'Low' : weather.humidity < 75 ? 'Medium' : 'High';

        // Step 4: Get soil
        let soil_type = manual_soil_type;
        let soil_info = { soil_type };
        if (soil_mode === 'auto') {
            const soilRes = await axios.get(`${baseUrl}/soil`, { params: { lat, lon } });
            soil_type = soilRes.data.soil_type;
            soil_info = soilRes.data;
        }

        // Step 5: Prepare farmer inputs for soil_mapper
        const farmer_inputs = {
            temperature: weather.temperature,
            season: weather.season,
            soil_type,
            rainfall_level,
            humidity_level
        };

        // Step 6: ML prediction (top-3)
        const mlRes = await axios.post(`${flaskUrlLocal}/predict`, farmer_inputs);
        let top_crops = mlRes.data.recommended_crops || [{ crop: mlRes.data.crop, confidence: mlRes.data.confidence }];

        // Step 7: Climate filter
        const mlCrops = top_crops.map(c => c.crop);
        const filterRes = await axios.post(`${baseUrl}/filter-crops`, {
            crops: mlCrops,
            temperature: weather.temperature,
            rainfall: weather.rainfall
        });
        const filtered_indices = filterRes.data.filtered_crops.map(crop => mlCrops.indexOf(crop));
        const filtered_crops = filtered_indices.map(idx => top_crops[idx]).filter(Boolean).slice(0, 3);

        // Top 1
        const top1 = filtered_crops[0] || top_crops[0];

        // Save to Mongo
        const recommendation = new Recommendation({
            userId: 'guest',
            inputs: req.body,
            workflow: {
                location: { lat, lon },
                weather,
                soil_info,
                farmer_inputs,
                ml_top3: top_crops,
                climate_zone: weather.climate_zone,
                filtered_crops
            },
            result: {
                crop: top1.crop,
                confidence: top1.confidence,
                recommended_crops: filtered_crops
            }
        });
        await recommendation.save().catch(e => console.warn('Mongo save skipped:', e.message));

        // Response
        res.json({
            crop: top1.crop,
            confidence: top1.confidence,
            recommended_crops: filtered_crops,
            weather,
            soil_type,
            season: weather.season,
            climate_zone: weather.climate_zone,
            explanation: mlRes.data.explanation,
            mapped_values: mlRes.data.mapped_values,
            workflow_summary: farmer_inputs
        });
    } catch (err) {
        console.error('Error in /recommend:', err.message);
        const statusCode = err.response?.status || 500;
        const errorMessage = err.response?.data?.error !== undefined ? err.response.data.error : err.message;
        res.status(statusCode).json({ error: errorMessage, stack: err.stack, full: err.toString() });
    }
});

// GET /api/history
router.get('/history', async (req, res) => {
    try {
        const history = await Recommendation.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err.message);
        res.status(500).json({ error: 'Failed to fetch recommendation history' });
    }
});

// DELETE /api/history/:id
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Recommendation.findByIdAndDelete(id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Error deleting recommendation:', err.message);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

module.exports = router;
