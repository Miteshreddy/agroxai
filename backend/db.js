require('dotenv').config();
const mongoose = require('mongoose');

// Use env var or fallback to localhost
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cropdb';

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected to:', mongoUri.split('@')[1] || 'localhost'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Add a ping helper to verify actual database responsiveness
mongoose.ping = async () => {
    if (mongoose.connection.readyState !== 1) return false;
    try {
        await mongoose.connection.db.admin().ping();
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = mongoose;
