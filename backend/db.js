require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI not set");
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;
