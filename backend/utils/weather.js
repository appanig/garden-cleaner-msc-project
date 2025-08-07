const axios = require('axios');

const BAD_WEATHER_CODES = new Set([
  4000, 4001, 4200, 4201, // drizzle, rain, heavy rain
  5000, 5001, 5100, 5101, // snow
  6000, 6001, 6200, 6201, // freezing rain
  7000, 7101, 7102,       // ice pellets
  8000                   // thunderstorm
]);

async function shouldMakeBooking(lat, lon, dateString) {
  const API_KEY = process.env.TOMORROW_API_KEY;
  const endpoint = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&timesteps=1h&units=metric&apikey=${API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const forecasts = response.data.timelines.hourly;

    const targetDate = new Date(dateString);
    const targetDay = targetDate.toISOString().split('T')[0]; 

    const hoursOnTargetDay = forecasts.filter(hour => {
      return hour.time.startsWith(targetDay); 
    });

    if (hoursOnTargetDay.length === 0) {
      console.warn("No hourly data found for selected date.");
      return true; // allow booking if we can't check
    }

    const badWeather = hoursOnTargetDay.some(hour => {
      const {
        precipitationProbability,
        rainIntensity,
        windSpeed,
        weatherCode
      } = hour.values;

      return (
        precipitationProbability > 50 ||
        (rainIntensity !== undefined && rainIntensity > 0.1) ||
        windSpeed > 30 ||
        BAD_WEATHER_CODES.has(weatherCode)
      );
    });

    return !badWeather; // true if booking is safe
  } catch (err) {
    console.error("Weather API error:", err.message);
    return true; 
  }
}

module.exports = shouldMakeBooking;
