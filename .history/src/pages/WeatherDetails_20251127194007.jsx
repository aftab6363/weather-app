import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/weatherDetails.css";

const WeatherDetails = () => {
  const { city } = useParams();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch 7-day forecast
  const fetchForecast = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/weather/forecast?city=${city}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch forecast");
      }

      const data = await response.json();
      setForecast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [city]);

  return (
    <div className="weather-details-page">

      {/* Header */}
      <div className="details-header-container glass">
        <h1 className="details-title">
          7-Day Forecast for <span className="highlight">{city}</span>
        </h1>
        <p className="details-subtitle">Detailed weather trends & insights</p>
      </div>

      {/* Loading */}
      {loading && <div className="loading-text">Loading forecast...</div>}

      {/* Error */}
      {error && <div className="error-text">{error}</div>}

      {/* Forecast Data */}
      {forecast && (
        <div className="forecast-grid">
          {forecast.daily.slice(0, 7).map((day, index) => {
            const date = new Date(day.dt * 1000);
            const icon = day.weather[0].icon;
            const description = day.weather[0].description;

            return (
              <div key={index} className="forecast-card glass fade-in">
                <div className="forecast-date">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description}
                  className="forecast-icon"
                />

                <div className="forecast-temp">
                  <span className="temp-max">{Math.round(day.temp.max)}°C</span>
                  <span className="temp-min">{Math.round(day.temp.min)}°C</span>
                </div>

                <div className="forecast-info">
                  <p className="info-line">
                    🌡 Feels Like: {Math.round(day.feels_like.day)}°C
                  </p>
                  <p className="info-line">💧 Humidity: {day.humidity}%</p>
                  <p className="info-line">💨 Wind: {day.wind_speed} m/s</p>
                  <p className="info-line">
                    📊 Pressure: {day.pressure} hPa
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherDetails;
