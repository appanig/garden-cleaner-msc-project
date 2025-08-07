const Booking = require("../models/Booking");
const ServiceProvider = require("../models/ServiceProvider");
const Service = require("../models/Service");
const { getIO, getOnlineProviders, getOnlineHomeowners } = require('../utils/socket');

const multer = require("multer");
const Review = require("../models/Review");

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { serviceId, scheduledDate, notes, place } = req.body;
        const service = await Service.findById(serviceId).populate("provider");


        if (!service) return res.status(404).json({ message: "Service not found" });

        const newBooking = await Booking.create({
            homeowner: req.user._id,
            provider: service.provider._id,
            serviceType: service.name,
            scheduledDate,
            place,
            price: service.price,
            notes,
        });

        const io = getIO();
        const onlineProviders = getOnlineProviders();

        const key = String(service.provider._id);
        const providerSocketId = onlineProviders.get(key);

        if (providerSocketId) {
            io.to(providerSocketId).emit("newBooking", {
                serviceName: service.name,
                date: scheduledDate,
                homeownerName: req.user.name,
                place,
                notes,
            });
        }


        res.status(201).json({ booking: newBooking });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["pending", "accepted", "rejected", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid status. Must be one of: " + validStatuses.join(", "),
            });
        }

        // Find the booking by ID
        const booking = await Booking.findById(bookingId).populate("homeowner");
        if (!booking) {
            return res.status(404).json({
                status: "fail",
                message: "Booking not found",
            });
        }

        const serviceProvider = await ServiceProvider.findOne({ user: req.user._id });

        // Ensure the provider is authorized to update this booking
        if (booking.provider.toString() !== serviceProvider._id.toString()) {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to update this booking",
            });
        }


        io = getIO();
        const onlineHomeowners = getOnlineHomeowners();
        const key = String(booking.homeowner._id);

        const homeownerSocketId = onlineHomeowners.get(key);

        if (homeownerSocketId) {
            io.to(homeownerSocketId).emit("bookingUpdate", {
                homeownerName: booking.homeowner.name,
                service: booking.serviceType,
                place: booking.place,
                date: booking.scheduledDate.toDateString(),
                status
            });
        }



        // Update the booking status
        booking.status = status;
        await booking.save();

        // Respond with the updated booking
        res.status(200).json({
            status: "success",
            data: {
                booking,
            },
        });
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({
            status: "error",
            message: "Server error while updating booking",
        });
    }
};

exports.completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("homeowner");
        if (!booking) return res.status(404).send("Not found");


        const serviceProvider = await ServiceProvider.findOne({ user: req.user._id });

        // Ensure the provider is authorized to update this booking
        if (booking.provider.toString() !== serviceProvider._id.toString()) {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to update this booking",
            });
        }


        if (req.files.beforeImage && req.files.beforeImage[0]) {
            booking.beforeImage = `uploads/photos/${req.files.beforeImage[0].filename}`;
        }

        if (req.files.afterImage && req.files.afterImage[0]) {
            booking.afterImage = `uploads/photos/${req.files.afterImage[0].filename}`;
        }




        io = getIO();
        const onlineHomeowners = getOnlineHomeowners();
        const key = String(booking.homeowner._id);

        const homeownerSocketId = onlineHomeowners.get(key);


        if (homeownerSocketId) {
            io.to(homeownerSocketId).emit("bookingUpdate", {
                homeownerName: booking.homeowner.name,
                service: booking.serviceType,
                place: booking.place,
                date: booking.scheduledDate.toDateString(),
                status: "completed"
            });
        }

        booking.status = "completed";
        await booking.save();
        res.json({ message: "Order completed", booking });
    } catch (err) {
        console.error("Error while completeing order: ", err);
        res.status(500).json({ status: "error", message: "Server error while completing the booking" });
    }
}


// Get bookings for logged-in homeowner
exports.getHomeownerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ homeowner: req.user._id })
            .populate({
                path: "provider",
                select: "user services isEcoFriendly",
                populate: {
                    path: "user",
                    select: "name email location"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get bookings for logged-in provider
exports.getProviderBookings = async (req, res) => {
    try {
        const provider = await ServiceProvider.findOne({ user: req.user._id });
        if (!provider) {
            return res.status(404).json({ message: "Provider profile not found." });
        }

        const bookings = await Booking.find({ provider: provider._id })
            .populate("homeowner", "name email")
            .sort({ createdAt: -1 });


        res.status(200).json({ bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate("homeowner", "name email")
            .populate({
                path: "provider",
                select: "bio services ecoFriendly",
                populate: {
                    path: "user",
                    select: "name email location"
                }
            });


        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ booking });
    } catch (err) {
        console.error("Failed to fetch booking by ID", err);
        res.status(500).json({ message: "Server error." });
    }
};

exports.reviewBooking = async (req, res) => {
    const { review, rating } = req.body;

    try {
        const booking = await Booking.findById(req.params.id).populate("homeowner", "name email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only homeowner who made the booking can review
        if (booking.homeowner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to review this booking" });
        }

        if (booking.status !== "completed") {
            return res.status(400).json({ message: "Cannot review incomplete booking" });
        }

        // Create and save the review
        const newReview = new Review({
            booking: booking._id,
            provider: booking.provider._id,
            homeowner: booking.homeowner._id,
            rating,
            comment: review
        });

        await newReview.save();

        // Add the review to the provider and update average rating
        const allReviews = await Review.find({ provider: booking.provider._id });
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

        await ServiceProvider.findByIdAndUpdate(
            booking.provider._id,
            {
                $push: { reviews: newReview._id },
                $inc: { earnings: booking.price },
                rating: avgRating.toFixed(1)
            }
        );

        // Save review and rating in booking
        booking.review = review;
        booking.rating = rating;
        await booking.save();

        // Emit socket notification
        const io = getIO();
        const onlineProviders = getOnlineProviders();
        const key = String(booking.provider._id);
        const providerSocketId = onlineProviders.get(key);

        if (providerSocketId) {
            io.to(providerSocketId).emit("reviewPosted", {
                review,
                rating,
                status: 'reviewed',
                homeowner: booking.homeowner.name,
                bookingId: booking._id,
                date: new Date().toLocaleDateString()
            });
        }

        res.status(200).json({ message: "Review submitted successfully", booking });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
