const express = require("express");
const upload = require("../utils/upload");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const isApproved = require("../middlewares/isApproved");

// Create a booking (homeowners only)
router.post("/", protect, restrictTo("homeowner") , bookingController.createBooking);

// Update a booking (providers only)
router.put("/:bookingId/status", protect, restrictTo("provider"), isApproved,  bookingController.updateBooking);

// Complete a booking (providers only)
router.put("/complete/:id", protect, restrictTo("provider"), isApproved, upload.fields([{ name: "beforeImage", maxCount: 1 }, { name: "afterImage", maxCount: 1 }]),
    bookingController.completeBooking);

// Get bookings for homeowner
router.get("/homeowner", protect, restrictTo("homeowner"),  bookingController.getHomeownerBookings);

// Get bookings for provider
router.get("/provider", protect, restrictTo("provider"), isApproved, bookingController.getProviderBookings);

// Get bookings by id
router.get("/:id", protect, bookingController.getBookingById);

// POST /api/bookings/:id/review
router.post("/:id/review", protect, bookingController.reviewBooking);


module.exports = router;
