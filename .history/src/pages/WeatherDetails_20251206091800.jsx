import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/weatherDetails.css";

const WeatherDetails = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // ✅ Check login on page load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id && !user?.id) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ FIXED: Safe city validation (NO redirect when coming from premium cards)
  useEffect(() => {
    if (!city) return; // wait until router provides param

    if (typeof city !== "string" || city.trim().length === 0) {
      navigate("/dashboard");
    }
  }, [city, navigate]);

  // Fetch 5-day forecast
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
      if (!data || !Array.isArray(data)) throw new Error("Unexpected data format");

      setForecast(data);
    } catch (err) {
      console.error("5-day forecast error:", err);
      setError(err.message || "Failed to load forecast");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Save city function
  const saveCity = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || user?.id;

    if (!user || !userId) {
      setSaveMsg("Please login to save cities.");
      return;
    }

    try {
      setSaving(true);
      setSaveMsg("");

      const res = await fetch("http://localhost:5000/api/favorite-cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cityName: city }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save city");

      setSaveMsg("City saved successfully ✔");
    } catch (err) {
      console.error("Save city error:", err);
      setSaveMsg(err.message || "Failed to save city");
    } finally {
      setSaving(false);
    }
  };

  // Fetch forecast when city changes
  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  return (
    <div className="weather-details-page">
      <div className="weather-details-container">

        {/* HEADER */}
        <div className="summary-header">
          <h1 className="summary-title">5-Day Weather Forecast</h1>
          <p className="summary-city">{city}</p>

          <button onClick={saveCity} className="save-city-btn" disabled={saving}>
            {saving ? "Saving..." : "⭐ Save City"}
          </button>

          {saveMsg && <p className="save-message">{saveMsg}</p>}
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

                    <img src={iconUrl} alt={desc} className="forecast-icon" />

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
