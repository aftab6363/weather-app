import axios from "axios";

// CURRENT WEATHER (existing)
export const getWeather = async (req, res) => {
  try {
    const city = req.query.city?.trim();

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("Weather fetch error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const msg =
        status === 404
          ? `City not found: ${req.query.city}`
          : error.response.data?.message || "Failed to fetch weather data";

      return res.status(status).json({ message: msg });
    }

    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

// 7-DAY FORECAST (NEW)
export const get7DayForecast = async (req, res) => {
  try {
    const city = req.params.city?.trim();

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Step 1: Get lat/lon from city
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}`;
    const geoResp = await axios.get(geoUrl);
    const { lat, lon } = geoResp.data.coord;

    // Step 2: Get 7-day forecast using One Call API
    const forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric&appid=${apiKey}`;
    const forecastResp = await axios.get(forecastUrl);

    res.json(forecastResp.data.daily); // return only daily forecast
  } catch (error) {
    console.error("7-Day Forecast fetch error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const msg =
        status === 404
          ? `City not found: ${req.params.city}`
          : error.response.data?.message || "Failed to fetch 7-day forecast";

      return res.status(status).json({ message: msg });
    }

    res.status(500).json({ message: "Failed to fetch 7-day forecast" });
  }
};
