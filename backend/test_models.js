const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey, process.env.GEMINI_BASE_URL ? { apiVersion: 'v1beta', baseUrl: process.env.GEMINI_BASE_URL } : undefined);
        // The listModels method is on the client, but the SDK version might vary
        // Let's try a direct fetch if listModels isn't easily accessible
        console.log('Testing with different model IDs...');
        const modelsToTest = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-pro-latest'];
        
        for (const m of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent('Hi');
                console.log(`✅ Model ${m} is working!`);
                process.exit(0);
            } catch (err) {
                console.log(`❌ Model ${m} failed: ${err.message}`);
            }
        }
    } catch (err) {
        console.error('Fatal error:', err.message);
    }
}

listModels();
