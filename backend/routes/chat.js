const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are AgroXAI, an intelligent farming assistant built into a precision agriculture platform. You help Indian farmers with crop recommendations, soil health, fertilizer advice, pest management, irrigation, and market insights.

Rules:
- Keep responses SHORT (2-4 sentences max unless user asks for detail)
- Be practical and actionable
- Use simple language a farmer can understand
- Focus only on agriculture topics
- If asked about non-farming topics, politely redirect to farming
- Reference Indian farming context (seasons: Kharif, Rabi, Zaid; crops common in India)
- Use metric units (hectares, kg, mm rainfall)
- When given context about user's crop/soil/weather, tailor advice specifically to that.`;

router.post('/chat', async (req, res) => {
    console.log('--- Chat Request Received (Groq Engine) ---');
    try {
        const { message, context } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });
        if (!apiKey) return res.status(500).json({ error: 'Unable to generate response. Please try again.' });

        const groq = new Groq({ apiKey });

        let contextStr = '';
        if (context) {
            const parts = [];
            if (context.crop) parts.push(`Recommended Crop: ${context.crop}`);
            if (context.soilType) parts.push(`Soil Type: ${context.soilType}`);
            if (context.temperature) parts.push(`Temperature: ${context.temperature}°C`);
            if (context.humidity) parts.push(`Humidity: ${context.humidity}%`);
            if (context.rainfall) parts.push(`Rainfall: ${context.rainfall}mm`);
            if (context.season) parts.push(`Season: ${context.season}`);
            if (context.location) parts.push(`Location: ${context.location}`);
            if (parts.length > 0) {
                contextStr = `\n\nActive Farm Context:\n${parts.map(p => `- ${p}`).join('\n')}`;
            }
        }

        const messages = [
            { role: 'system', content: `${SYSTEM_PROMPT}${contextStr}` },
            { role: 'user', content: message.trim() }
        ];

        let responseText = '';
        try {
            console.log('Attempting with llama-3.3-70b-versatile...');
            const completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 512,
            });
            responseText = completion.choices[0]?.message?.content || '';
        } catch (groqErr) {
            console.warn('Groq Llama-3.3-70b failed, trying llama-3.1-8b-instant fallback...', groqErr.message);
            const completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 512,
            });
            responseText = completion.choices[0]?.message?.content || '';
        }

        console.log('Success! Sending response.');
        res.json({ reply: responseText });
    } catch (err) {
        console.error('--- Groq API Error ---');
        console.error(err.message);
        res.status(500).json({ error: 'AI service temporarily unavailable.' });
    }
});

// Test route to verify Groq connection
router.get('/test-groq', async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'No API Key configured.' });

        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello!' }],
            model: 'llama-3.1-8b-instant',
        });
        res.json({ status: 'success', reply: completion.choices[0]?.message?.content });
    } catch (err) {
        console.error('Test Route Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Unable to generate response. Please try again.' });
    }
});

module.exports = router;
