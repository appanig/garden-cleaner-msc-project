const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { getMyProviderProfile,getProviderProfileById, updateMyProviderProfile, getAllProviders, getTopThreeProviders} = require("../controllers/providerController");
const isApproved = require("../middlewares/isApproved");
const upload = require("../utils/upload");

// GET /api/provider/me
router.get("/me", protect, restrictTo("provider"), isApproved,  getMyProviderProfile);


router.get("/us/:id", protect,  getProviderProfileById);


// PUT /api/provider/me
router.put("/me", protect, restrictTo("provider"), isApproved, upload.single("profilePicture"), updateMyProviderProfile);

// GET all providers

router.get("/all", protect,  getAllProviders);

// Get top-3 providers on homepage

router.get('/top-3', getTopThreeProviders);

module.exports = router;
