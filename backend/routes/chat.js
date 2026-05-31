const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are AgroXAI, an intelligent farming assistant built into a precision agriculture platform. You help Indian farmers with crop recommendations, soil health, fertilizer advice, pest management, irrigation, and market insights.

Rules:
- Keep responses SHORT (2-4 sentences max unless user asks for detail)
- Be practical and actionable
- Use simple language a farmer can understand
- Focus only on agriculture topics
- If asked about non-farming topics, politely redirect to farming
- Reference Indian farming context (seasons: Kharif, Rabi, Zaid; crops common in India)
- Use metric units (hectares, kg, mm rainfall)
- When given context about user's crop/soil/weather, tailor advice specifically to that`;

router.post('/chat', async (req, res) => {
    console.log('--- Chat Request Received ---');
    try {
        const { message, context } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
        if (!apiKey) return res.status(500).json({ error: 'Gemini API key missing' });

        const genAI = new GoogleGenerativeAI(apiKey);
        
        let contextStr = '';
        if (context) {
            const parts = [];
            if (context.crop) parts.push(`Crop: ${context.crop}`);
            if (context.soilType) parts.push(`Soil: ${context.soilType}`);
            if (parts.length > 0) contextStr = `\nContext: ${parts.join(', ')}`;
        }

        const fullPrompt = `${SYSTEM_PROMPT}${contextStr}\n\nUser: ${message.trim()}`;
        
        let responseText = '';
        try {
            console.log('Attempting with gemini-3.5-flash...');
            const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
            const result = await model.generateContent(fullPrompt);
            responseText = result.response.text();
        } catch (flashErr) {
            console.warn('Gemini 3.5 Flash failed, trying gemini-flash-latest...', flashErr.message);
            const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
            const result = await model.generateContent(fullPrompt);
            responseText = result.response.text();
        }

        console.log('Success! Sending response.');
        res.json({ reply: responseText });
    } catch (err) {
        console.error('--- Gemini API Error ---');
        console.error(err.message);
        res.status(500).json({ error: 'Gemini API Error: ' + err.message });
    }
});

// Debug route to list models
router.get('/test-gemini', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'No API Key' });
        
        const genAI = new GoogleGenerativeAI(apiKey);
        // We can't easily list models with the SDK in some versions without an authenticated client
        // Let's just try a direct call to a different model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hi');
        res.json({ status: 'success', reply: result.response.text() });
    } catch (err) {
        console.error('Test Route Error:', err.message);
        res.status(500).json({ status: 'error', message: err.message, key_preview: apiKey.substring(0, 10) + '...' });
    }
});

module.exports = router;
