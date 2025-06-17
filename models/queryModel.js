const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    query: { type: String, required: true },
    result: { type: String },
    type: { type: String, enum: ['insight', 'dataset', 'decision'], required: true },
    createdAt: { type: Date, default: Date.now },
    bookmarked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Query', querySchema);
