require('dotenv').config();
const mongoose = require('mongoose');

// Use env var or fallback to localhost
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cropdb';

mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Continue without DB – the app will still run but DB ops will fail gracefully
    });

module.exports = mongoose;
