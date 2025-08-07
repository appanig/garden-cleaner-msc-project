const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  name: { type: String, required: true }, // e.g., "Gardening", "Roof Cleaning"
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String }, // e.g., "1 hour", "2 hours"
  addons: [String], // Optional: ["Compost Removal", "Lawn Edging"]
  ecoFriendly: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", serviceSchema);
