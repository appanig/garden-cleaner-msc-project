const ServiceProvider = require("../models/ServiceProvider");
const Review = require('../models/Review');
const User = require("../models/User");
const Service = require("../models/Service");

exports.getMyProviderProfile = async (req, res) => {
  try {

    const provider = await ServiceProvider.findOne({ user: req.user.id })
      .populate('user', 'name email profilePicture location')
      .populate({
        path: "services",
        model: "Service"
      })
      .populate({
        path: 'reviews',
        model: "Review",
        populate: {
          path: 'homeowner',
          select: 'name',
        },
      });


    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Optional: Recalculate average rating on the fly (if not persisted)
    let averageRating = 0;
    if (provider.reviews.length > 0) {
      const total = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = total / provider.reviews.length;
    }

    res.json({
      ...provider.toObject(),
      averageRating: averageRating.toFixed(1),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getProviderProfileById = async (req, res) => {
  try {

    const provider = await ServiceProvider.findById(req.params.id)
      .populate('user', 'name email profilePicture location')
      .populate({
        path: "services",
        model: "Service"
      })
      .populate({
        path: 'reviews',
        model: "Review",
        populate: {
          path: 'homeowner',
          select: 'name',
        },
      });


    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    let averageRating = 0;
    if (provider.reviews.length > 0) {
      const total = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = total / provider.reviews.length;
    }


    res.status(200).json({
      ...provider.toObject(),
      averageRating: averageRating.toFixed(1),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }

}


exports.updateMyProviderProfile = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.file) {
      // Save file path relative to public directory
      user.profilePicture = `/uploads/photos/${req.file.filename}`;
    }

    await user.save();

    // Update provider fields
    provider.bio = req.body.bio || provider.bio;
    provider.location = req.body.location || provider.location;
    provider.isEcoFriendly = req.body.isEcoFriendly ?? provider.isEcoFriendly;

    await provider.save();

    const updated = await ServiceProvider.findById(provider._id)
      .populate("user", "name email profilePicture location")
      .populate({
        path: "services",
        model: "Service"
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'homeowner',
          select: 'name',
        },
      });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ isApproved: true })
      .populate('services')
      .populate('user', 'name email profilePicture location');


    res.status(200).json(providers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}

exports.getTopThreeProviders = async (req, res) => {
  try {
    const topProviders = await Review.aggregate([
      {
        $group: {
          _id: '$provider',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1, reviewCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: '_id',
          foreignField: '_id',
          as: 'provider'
        }
      },
      { $unwind: '$provider' },

      {
        $lookup: {
          from: 'users',
          localField: 'provider.user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          providerId: '$_id',
          avgRating: 1,
          reviewCount: 1,
          services: '$provider.services',
          isEcoFriendly: '$provider.isEcoFriendly',
          name: '$user.name',
          email: '$user.email',
          profilePicture: '$user.profilePicture'
        }
      }
    ]);

    res.status(200).json(topProviders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};