const axios = require('axios');
require('dotenv').config();

async function testManual() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    try {
        console.log('Testing manual v1 endpoint...');
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: 'Hi' }] }]
        });
        console.log('✅ Manual v1 worked!', JSON.stringify(response.data).substring(0, 100));
    } catch (err) {
        console.log(`❌ Manual v1 failed: ${err.response?.status} ${err.response?.statusText}`);
        if (err.response?.data) console.log('Error Data:', JSON.stringify(err.response.data));
    }

    const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    try {
        console.log('Testing manual v1beta endpoint...');
        const response = await axios.post(urlBeta, {
            contents: [{ parts: [{ text: 'Hi' }] }]
        });
        console.log('✅ Manual v1beta worked!');
    } catch (err) {
        console.log(`❌ Manual v1beta failed: ${err.response?.status} ${err.response?.statusText}`);
    }
}

testManual();
