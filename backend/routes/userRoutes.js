
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const upload = require("../utils/upload"); 

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/profile", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'homeowner') {
      return res.status(404).json({ message: "Homeowner not found" });
    }

    user.name = req.body.name || user.name;
    user.password = req.body.password || user.password;

    if (req.file) {
      user.profilePicture = `/uploads/photos/${req.file.filename}`;
    }

    const updated = await user.save();
    res.json({
      name: updated.name,
      email: updated.email,
      profilePicture: updated.profilePicture,
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
