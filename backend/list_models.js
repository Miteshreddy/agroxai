const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        console.log('Fetching available models for this key...');
        const response = await axios.get(url);
        console.log('Available Models:', JSON.stringify(response.data.models.map(m => m.name)));
    } catch (err) {
        console.log(`❌ Failed to list models: ${err.response?.status} ${err.response?.statusText}`);
        if (err.response?.data) console.log('Error Data:', JSON.stringify(err.response.data));
    }
}

listModels();
