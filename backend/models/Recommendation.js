const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    inputs: { type: Object, required: true },
    result: {
        crop: String,
        confidence: Number,
        explanation: Object,
        mapped_values: Object,
    },
    createdAt: { type: Date, default: Date.now },
}, { strict: false });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
