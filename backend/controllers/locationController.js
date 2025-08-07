const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

exports.updateUserLocation = async (req, res) => {
  const { userId, latitude, longitude, location } = req.body;

  if (!userId || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const locationStr = location;

  try {
   
    await User.findByIdAndUpdate(userId, {
      location: {
        place: locationStr,
        coordinates: [longitude, latitude], 
      },
    });

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
