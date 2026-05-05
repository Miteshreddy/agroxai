require('dotenv').config();
const mongoose = require('mongoose');

// Use env var or fallback to localhost
// Direct hardcoded test URI (with password encoding)
const mongoUri = 'mongodb+srv://agroxai:Kmit123%24@agroxai.veuwuha.mongodb.net/cropdb?retryWrites=true&w=majority';

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
