const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const { success, error: errorRes } = require('../utils/response');
const cropData = require('../utils/cropData');

const getCropMetadata = (cropName) => {
    if (!cropName) return { total_duration: 'Varies', difficulty: 'Medium' };
    
    const clean = cropName.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-z]/g, '');
        
    for (const key of Object.keys(cropData)) {
        const cleanKey = key.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\(.*?\)/g, '')
            .replace(/[^a-z]/g, '');
            
        if (clean.includes(cleanKey) || cleanKey.includes(clean)) {
            return cropData[key];
        }
    }
    
    return { total_duration: 'Varies', difficulty: 'Medium' };
};

// POST /api/recommend
router.post('/recommend', async (req, res) => {
    try {
        const { location, soil_mode = 'manual', manual_soil_type = 'Loamy' } = req.body;

        if (!location) {
            return errorRes(res, 'Location is required', 400);
        }

        // Use process.env for URLs or derive from request host
        const protocol = req.protocol;
        const host = req.get('host');
        const selfUrl = `${protocol}://${host}/api`;
        const mlUrl = process.env.ML_API_URL || `${process.env.FLASK_URL || 'http://localhost:5001'}/predict`;

        // Step 1: Get coordinates
        let lat = location.lat || location.latitude;
        let lon = location.lon || location.longitude;
        
        if (!lat || !lon) {
            const { state, district, village } = location;
            if (!state && !district) {
                return errorRes(res, 'State or district required for manual location', 400);
            }
            const geoRes = await axios.get(`${selfUrl}/geocode`, { params: { state, district, village } });
            lat = geoRes.data.latitude;
            lon = geoRes.data.longitude;
        }

        if (!lat || !lon) {
            return errorRes(res, 'Could not resolve location coordinates', 400);
        }

        // Step 2: Get weather
        const weatherRes = await axios.get(`${selfUrl}/weather`, { params: { lat, lon } });
        const weather = weatherRes.data.data;

        // Step 3: Derive descriptive levels
        const rainfall_level = weather.rainfall < 70 ? 'Low' : weather.rainfall < 170 ? 'Medium' : 'High';
        const humidity_level = weather.humidity < 35 ? 'Low' : weather.humidity < 75 ? 'Medium' : 'High';

        // Step 4: Get soil
        let soil_type = manual_soil_type;
        let soil_info = { soil_type };
        if (soil_mode === 'auto') {
            const soilRes = await axios.get(`${selfUrl}/soil`, { params: { lat, lon } });
            soil_type = soilRes.data.soil_type;
            soil_info = soilRes.data;
        }

        // Step 5: Prepare farmer inputs
        const farmer_inputs = {
            temperature: weather.temperature,
            humidity: weather.humidity,
            rainfall: weather.rainfall,
            season: weather.season,
            soil_type,
            rainfall_level,
            humidity_level
        };

        // Step 6: ML prediction
        const mlRes = await axios.post(mlUrl, farmer_inputs);
        let top_crops = mlRes.data.recommended_crops || [{ crop: mlRes.data.crop, confidence: mlRes.data.confidence }];

        // Step 7: Climate filter
        const mlCrops = top_crops.map(c => c.crop);
        const filterRes = await axios.post(`${selfUrl}/filter-crops`, {
            crops: mlCrops,
            temperature: weather.temperature,
            rainfall: weather.rainfall
        });
        const filtered_indices = filterRes.data.filtered_crops.map(crop => mlCrops.indexOf(crop));
        const filtered_crops = filtered_indices.map(idx => top_crops[idx]).filter(Boolean).slice(0, 3);

        // Ensure we always have exactly 3 crops for the comparison panel to render consistently
        let final_recommended = [...filtered_crops];
        for (const tc of top_crops) {
            if (final_recommended.length >= 3) break;
            if (!final_recommended.some(c => c.crop === tc.crop)) {
                final_recommended.push(tc);
            }
        }

        const top1 = final_recommended[0] || top_crops[0];

        // Enrich with crop metadata
        const cropInfo = getCropMetadata(top1.crop);

        // Save to Mongo
        const recommendation = new Recommendation({
            userId: req.user?.id || 'guest',
            inputs: req.body,
            workflow: {
                location: { lat, lon },
                weather,
                soil_info,
                farmer_inputs,
                ml_top3: top_crops,
                filtered_crops: final_recommended
            },
            result: {
                crop: top1.crop,
                confidence: top1.confidence,
                recommended_crops: final_recommended,
                total_duration: cropInfo.total_duration,
                explanation: mlRes.data.explanation,
                mapped_values: mlRes.data.mapped_values
            }
        });
        await recommendation.save().catch(e => console.warn('Mongo save skipped:', e.message));

        return success(res, {
            crop: top1.crop,
            confidence: top1.confidence,
            recommended_crops: final_recommended,
            weather,
            soil_type,
            explanation: mlRes.data.explanation,
            mapped_values: mlRes.data.mapped_values,
            workflow_summary: farmer_inputs,
            total_duration: cropInfo.total_duration
        });
    } catch (err) {
        console.error('Error in /recommend:', err.message);
        const statusCode = err.response?.status || 500;
        return errorRes(res, 'Recommendation service temporarily unavailable', statusCode, err.message);
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
