import axios from "axios";

// CURRENT WEATHER
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
    const data = response.data;

    // Normalized response for frontend
    const normalized = {
      city: `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      wind: data.wind?.speed,
      description:
        data.weather && data.weather[0] ? data.weather[0].description : "",
      icon:
        data.weather && data.weather[0]
          ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          : null,
      raw: data,
    };

    res.json(normalized);
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

// 5-DAY / 3-HOUR FORECAST (Free API replacement for One Call)
export const get7DayForecast = async (req, res) => {
  try {
    const city = req.params.city?.trim();

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Free 5-day / 3-hour forecast API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const forecastResp = await axios.get(forecastUrl);
    const list = forecastResp.data.list;

    // Convert 3-hour data into daily summary
    const dailyMap = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date: item.dt * 1000,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          wind: item.wind.speed,
          weather: item.weather && item.weather[0] ? item.weather[0] : {},
        };
      } else {
        dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, item.main.temp_min);
        dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp_max);
      }
    });

    const dailyForecast = Object.values(dailyMap).slice(0, 5); // first 5 days

    res.json(dailyForecast);
  } catch (error) {
    console.error("Forecast fetch error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const msg =
        status === 404
          ? `City not found: ${req.params.city}`
          : error.response.data?.message || "Failed to fetch forecast";

      return res.status(status).json({ message: msg });
    }

    res.status(500).json({ message: "Failed to fetch forecast" });
  }
};
