const express = require('express');
const router = express.Router();
const shouldMakeBooking = require('../utils/weather');
const axios = require("axios");
const { protect, restrictTo } = require('../middlewares/authMiddleware');


router.post('/', protect, restrictTo("homeowner"), async (req, res) => {
    const { place, scheduledDate  } = req.body;
    const apiKey = process.env.OPENCAGE_API_KEY;

      if (!place || !scheduledDate) {
      return res.status(400).json({ message: "Place and date are required." });
    }
    try {
        const geoRes = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}`);

        const geoData = geoRes.data;
        const coords = geoData.results[0]?.geometry;
    

        if (!coords) return res.status(400).json({ message: 'Could not geocode location' });

        const isGoodWeather = await shouldMakeBooking(coords.lat, coords.lng, scheduledDate);
    
        res.json({ ok: isGoodWeather });
    } catch (err) {
        console.error("Weather check failed:", err.message);
        res.status(500).json({ message: 'Weather check failed' });
    }
});

module.exports = router;
