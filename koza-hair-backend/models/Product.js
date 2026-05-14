const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    bottleSize: String,
    stockAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    reviews: [reviewSchema] // Nested array for reviews
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);