import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/weatherDetails.css";

const WeatherDetails = () => {
  const { city } = useParams(); // from /weather/:city
  const navigate = useNavigate();

  const [forecast, setForecast] = useState(null); // array of daily objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchForecast = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      setForecast(null);

      // <-- CORRECT endpoint: matches your backend mount at /api/weather
      const res = await fetch(
        `http://localhost:5000/api/weather/7days/${encodeURIComponent(cityName)}`
      );

      // If server sends HTML (404 page) you'll hit this non-ok branch
      if (!res.ok) {
        let errMsg = `Status ${res.status}`;
        try {
          const body = await res.json();
          errMsg = body.message || body.error || errMsg;
        } catch (parseErr) {
          // response wasn't JSON
        }
        throw new Error(errMsg);
      }

      // backend returns an array (daily)
      const data = await res.json();

      // ensure we have an array
      if (!Array.isArray(data)) {
        // if backend returned { daily: [...] } adapt to that
        if (data && Array.isArray(data.daily)) {
          setForecast(data.daily.slice(0, 7));
        } else {
          throw new Error("Unexpected forecast format");
        }
      } else {
        setForecast(data.slice(0, 7));
      }
    } catch (err) {
      console.error("Fetch 7-day error:", err);
      setError(err.message || "Failed to fetch forecast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  return (
    <div className="weather-details-page">
      <div className="weather-details-container">
        <div className="weather-details-card">
          <div className="details-header">
            <h1 className="city-title">
              7-Day Forecast — <span style={{ color: "white" }}>{city}</span>
            </h1>
            <p className="weather-tagline">Detailed weather trends & insights</p>
          </div>

          {loading && <div className="loading-text">Loading forecast...</div>}
          {error && <div className="error-text" style={{ color: "#ffdddd" }}>{error}</div>}

          {!loading && !error && Array.isArray(forecast) && (
            <>
              <div className="forecast-section">
                <h2 className="forecast-title">Weekly Outlook</h2>

                <div className="forecast-grid">
                  {forecast.map((day, idx) => {
                    const date = new Date(day.dt * 1000);
                    const icon = day.weather?.[0]?.icon || "";
                    const desc = day.weather?.[0]?.description || "";

                    return (
                      <div key={idx} className="forecast-card glass">
                        <div className="forecast-day">
                          {date.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>

                        <img
                          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                          alt={desc}
                          className="forecast-icon"
                        />

                        <div className="forecast-temp">
                          <span className="temp-max">{Math.round(day.temp?.max)}°C</span>
                          <span className="temp-min">{Math.round(day.temp?.min)}°C</span>
                        </div>

                        <div className="forecast-desc">{desc}</div>

                        <div className="forecast-info">
                          <p>Feels: {Math.round(day.feels_like?.day)}°C</p>
                          <p>Humidity: {day.humidity}%</p>
                          <p>Wind: {day.wind_speed} m/s</p>
                          <p>Sunrise: {new Date(day.sunrise * 1000).toLocaleTimeString()}</p>
                          <p>Sunset: {new Date(day.sunset * 1000).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="back-btn" onClick={() => navigate(-1)}>
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
