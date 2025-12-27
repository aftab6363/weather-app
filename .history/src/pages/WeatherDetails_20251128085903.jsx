import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/weatherDetails.css";

const WeatherDetails = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Select 12 PM entry for each of the 5 days
  const extractDailyData = (list) => {
    const daily = {};

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();

      if (date.getHours() === 12 && !daily[day]) {
        daily[day] = item;
      }
    });

    return Object.values(daily).slice(0, 5);
  };

  const fetchForecast = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      setForecast([]);

      const res = await fetch(
        `http://localhost:5000/api/weather/5days/${encodeURIComponent(cityName)}`
      );

      if (!res.ok) {
        let msg = `Status: ${res.status}`;
        try {
          const body = await res.json();
          msg = body.message || body.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();

      if (!data || !Array.isArray(data.list)) {
        throw new Error("Unexpected data format");
      }

      const cleaned = extractDailyData(data.list);
      setForecast(cleaned);
    } catch (err) {
      console.error("5-day forecast error:", err);
      setError(err.message || "Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  // Set dynamic background based on first day's weather
  const getBackgroundByWeather = (condition) => {
    if (!condition) return "default-bg";

    const c = condition.toLowerCase();

    if (c.includes("rain")) return "rain-bg";
    if (c.includes("cloud")) return "cloud-bg";
    if (c.includes("clear")) return "clear-bg";
    if (c.includes("storm") || c.includes("thunder")) return "storm-bg";
    if (c.includes("snow")) return "snow-bg";

    return "default-bg";
  };

  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  // Determine background
  const backgroundClass = forecast[0]
    ? getBackgroundByWeather(forecast[0].weather?.[0]?.main)
    : "default-bg";

  return (
    <div className={`weather-details-page ${backgroundClass}`}>
      <div className="weather-details-container">

        {/* Summary Header */}
        <div className="summary-header">
          <h1 className="summary-title">5-Day Weather Forecast</h1>
          <p className="summary-city">{city}</p>
        </div>

        {loading && <div className="loading-text">Loading weather...</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && forecast.length > 0 && (
          <div className="forecast-section">
            <div className="forecast-grid">
              {forecast.map((item, index) => {
                const date = new Date(item.dt * 1000);

                const icon = item.weather?.[0]?.icon;
                const desc = item.weather?.[0]?.description;

                return (
                  <div className="forecast-card" key={index}>
                    <div className="forecast-day">
                      {date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Weather Icon */}
                    <img
                      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                      alt={desc}
                      className="forecast-icon"
                    />

                    {/* Temperature */}
                    <div className="forecast-temp">
                      {Math.round(item.main.temp)}°C
                    </div>

                    <div className="forecast-desc">{desc}</div>

                    {/* Extra Info */}
                    <div className="forecast-info">
                      <p>Humidity: {item.main.humidity}%</p>
                      <p>Wind: {item.wind.speed} m/s</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
