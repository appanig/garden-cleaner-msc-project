const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const Service = require("../models/Service");
const ServiceProvider = require("../models/ServiceProvider");
const isApproved = require("../middlewares/isApproved");

// POST /api/services
router.post("/", protect, restrictTo("provider"), isApproved, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const service = await Service.create({ ...req.body, provider: provider._id });
    provider.services.push(service._id);
    await provider.save();

    res.status(201).json({ service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/my-services
router.get("/my-services", protect, restrictTo("provider"), isApproved, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id });

    const services = await Service.find({ provider: provider._id });

    res.json({ services });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find({}).populate({
      path: "provider",
      populate: {
        path: "user",
        select: "name email location"
      }
    });

    res.json({ services });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE service
router.delete("/:id", protect, restrictTo("provider"), isApproved, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);

  await ServiceProvider.updateMany(
    { services: req.params.id },
    { $pull: { services: req.params.id } }
  );

  res.json({ message: "Deleted" });
});

// PUT update service
router.put("/:id", protect, restrictTo("provider"), isApproved, async (req, res) => {
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ service: updated });
});


module.exports = router;
