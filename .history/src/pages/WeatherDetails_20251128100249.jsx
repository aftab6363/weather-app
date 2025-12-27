import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/WeatherDetails.css";

// Import local images
import sunnyImg from "../assets/sunny.jpg";
import cloudyImg from "../assets/cloudy.jpg";
import stormImg from "../assets/storm.jpg";
import windImg from "../assets/wind.jpg";
import rainyImg from "../assets/rainy.jpg";

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

  // Map weather condition to local image
  const getBackgroundByWeather = (condition) => {
    if (!condition) return sunnyImg;
    const c = condition.toLowerCase();
    if (c.includes("rain")) return rainyImg;
    if (c.includes("cloud")) return cloudyImg;
    if (c.includes("clear")) return sunnyImg;
    if (c.includes("storm") || c.includes("thunder")) return stormImg;
    if (c.includes("wind")) return windImg;
    return sunnyImg;
  };

  // Map daily card weather to local icon image
  const getIconByWeather = (condition) => {
    if (!condition) return sunnyImg;
    const c = condition.toLowerCase();
    if (c.includes("rain")) return rainyImg;
    if (c.includes("cloud")) return cloudyImg;
    if (c.includes("clear")) return sunnyImg;
    if (c.includes("storm") || c.includes("thunder")) return stormImg;
    if (c.includes("wind")) return windImg;
    return sunnyImg;
  };

  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  // Main background based on first day
  const mainBackground = forecast[0]
    ? getBackgroundByWeather(forecast[0].weather?.main)
    : sunnyImg;

  return (
    <div
      className="weather-details-page"
      style={{
        backgroundImage: `url(${mainBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
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
                const desc = item.weather?.description || "";
                const temp = Math.round(item.temp?.day || item.feels_like?.day);
                const humidity = item.humidity;
                const wind = item.wind_speed;

                const iconImg = getIconByWeather(item.weather?.main);

                return (
                  <div
                    className="forecast-card"
                    key={index}
                    style={{
                      backgroundImage: `url(${iconImg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="forecast-day">
                      {date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Temperature */}
                    <div className="forecast-temp">{temp}°C</div>

                    <div className="forecast-desc">{desc}</div>

                    {/* Extra Info */}
                    <div className="forecast-info">
                      <p>Humidity: {humidity}%</p>
                      <p>Wind: {wind} m/s</p>
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
