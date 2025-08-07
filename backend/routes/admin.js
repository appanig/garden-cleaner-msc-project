const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require("../middlewares/isAdmin");

// Get all providers
router.get('/all-providers', protect, isAdmin, async (req, res) => {
  const providers = await ServiceProvider.find({ isApproved: true })
  .populate('services')
  .populate('user', 'name email location');
  res.json(providers);
});



// Reject a provider (optional: delete or flag)
router.delete('/reject/:id', protect, isAdmin, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Delete the related user account
    if (provider.user) {
      await User.findByIdAndDelete(provider.user);
    }

    // Delete all services created by this provider
    await Service.deleteMany({ provider: provider._id });

    // Delete all bookings associated with this provider
    await Booking.deleteMany({ provider: provider._id });

    // Delete the provider record
    await ServiceProvider.findByIdAndDelete(provider._id);

    res.json({ message: 'Provider, user, services, and bookings deleted successfully' });
  } catch (err) {
    console.error("Error deleting provider and related data:", err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
