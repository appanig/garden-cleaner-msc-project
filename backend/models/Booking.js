
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    homeowner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'rejected'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    beforeImage: {
        type: String
    },
    afterImage: {
        type: String
    },
    review: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
