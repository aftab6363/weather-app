import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/weatherDetails.css";

const WeatherDetails = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      if (!data || !Array.isArray(data)) {
        throw new Error("Unexpected data format");
      }

      setForecast(data);
    } catch (err) {
      console.error("5-day forecast error:", err);
      setError(err.message || "Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REMOVE LOCAL ICON MAPPING — Not needed anymore

  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  return (
    <div className="weather-details-page">
      <div className="weather-details-container">
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
                const desc = item.weather?.description || "";
                const temp = Math.round(item.temp?.day || item.feels_like?.day);
                const humidity = item.humidity;
                const wind = item.wind_speed;

                // 🔥 USE OFFICIAL OPENWEATHER ICONS
                const iconUrl = `https://openweathermap.org/img/wn/${item.weather?.icon}@4x.png`;

                return (
                  <div className="forecast-card" key={index}>
                    <div className="forecast-day">
                      {date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* WEATHER ICON */}
                    <img
                      src={iconUrl}
                      alt={desc}
                      className="forecast-icon"
                    />

                    <div className="forecast-temp">{temp}°C</div>

                    <div className="forecast-desc">{desc}</div>

                    <div className="forecast-info">
                      <p>Humidity: {humidity}%</p>
                      <p>Wind: {wind} m/s</p>
                    </div>
                  </div>
                );
              })}
            </div>

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
