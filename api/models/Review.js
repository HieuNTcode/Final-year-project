const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;