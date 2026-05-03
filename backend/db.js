require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI not set");
}

mongoose.connect(MONGO_URI)
    .then(() => {
        // Test connection
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB Atlas connected");
        }
    })
    .catch(err => {
        console.log("MongoDB connection failed", err);
    });

module.exports = mongoose;
