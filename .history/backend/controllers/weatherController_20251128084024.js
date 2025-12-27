import axios from "axios";

// CURRENT WEATHER (unchanged)
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
// This returns an array of daily-like objects shaped to match frontend expectations.
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
    const list = forecastResp.data.list; // 3-hourly entries

    // Convert 3-hour data into daily summary map keyed by YYYY-MM-DD
    const dailyMap = {}; // { "2025-11-28": { dt, temp_min, temp_max, humiditySum, count, wind, weather } }
    list.forEach((item) => {
      const dateKey = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          dt: item.dt, // keep seconds (first occurrence)
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humiditySum: item.main.humidity,
          count: 1,
          wind: item.wind?.speed || 0,
          weather: item.weather && item.weather[0] ? item.weather[0] : {},
        };
      } else {
        dailyMap[dateKey].temp_min = Math.min(dailyMap[dateKey].temp_min, item.main.temp_min);
        dailyMap[dateKey].temp_max = Math.max(dailyMap[dateKey].temp_max, item.main.temp_max);
        dailyMap[dateKey].humiditySum += item.main.humidity;
        dailyMap[dateKey].count += 1;
        // keep wind as last seen (or you could average)
        dailyMap[dateKey].wind = item.wind?.speed || dailyMap[dateKey].wind;
        // prefer the earlier "weather" if exists; keep existing
      }
    });

    // Convert dailyMap to array and shape each day to match "daily" structure used in frontend
    const dailyForecast = Object.keys(dailyMap)
      .map((dateKey) => {
        const v = dailyMap[dateKey];
        const avgHumidity = Math.round(v.humiditySum / v.count);
        const feelsLikeDay = Math.round((v.temp_min + v.temp_max) / 2); // simple estimate

        return {
          // keep dt in seconds — frontend will multiply by 1000 when creating Date
          dt: v.dt,
          // match OpenWeather daily.temp structure
          temp: {
            min: Math.round(v.temp_min),
            max: Math.round(v.temp_max),
          },
          // simple feels_like structure (day)
          feels_like: {
            day: feelsLikeDay,
          },
          humidity: avgHumidity,
          // name matches frontend expectation: wind_speed
          wind_speed: v.wind,
          // weather object (first/representative)
          weather: v.weather,
          // forecast API does not provide sunrise/sunset per day — set null explicitly
          sunrise: null,
          sunset: null,
        };
      })
      .slice(0, 5); // return first 5 days (available from 5-day forecast)

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
