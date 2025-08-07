const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: String,
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    isEcoFriendly: {
        type: Boolean,
        default: false
    },
    earnings: { type: Number, default: 0 },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isApproved: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("ServiceProvider", providerSchema);
