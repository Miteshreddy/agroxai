const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The listModels method is on the client, but the SDK version might vary
        // Let's try a direct fetch if listModels isn't easily accessible
        console.log('Testing with different model IDs...');
        const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
        
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
