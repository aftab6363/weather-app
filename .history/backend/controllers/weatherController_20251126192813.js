import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const city = req.query.city?.trim(); // trim spaces

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    // OpenWeatherMap always returns city data even if name case differs
    res.json(response.data);

  } catch (error) {
    console.error("Weather fetch error:", error.message);

    if (error.response) {
      // API returned an error (e.g., city not found)
      const status = error.response.status;
      const msg =
        status === 404
          ? `City not found: ${req.query.city}`
          : error.response.data?.message || "Failed to fetch weather data";

      return res.status(status).json({ message: msg });
    }

    // Network or other errors
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};
