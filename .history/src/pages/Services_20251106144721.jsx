import React, { useEffect } from "react";
import "../styles/dashboard.css";

import sunny from "../assets/sunny.jpg";
import rain from "../assets/rainy.jpg";
import clouds from "../assets/cloudy.jpg";
import storm from "../assets/storm.jpg";
import wind from "../assets/wind.jpg";

function Dashboard() {

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="dashboard-page">

      {/* ===== Page Header ===== */}
      <section className="dashboard-header fade-in-up">
        <h1>Weather Dashboard</h1>
        <p>
          Explore weather insights to stay updated and prepared anywhere, anytime.
        </p>
      </section>

      {/* ===== Cards ===== */}
      <section className="dashboard-section">
        <div className="dashboard-cards">

          <div className="dashboard-card fade-in-up">
            <img src={sunny} alt="Sunny Weather" />
            <h3>Sunny Conditions</h3>
            <p>UV index, heat alerts & daylight temperature insights.</p>
          </div>

          <div className="dashboard-card fade-in-up">
            <img src={rain} alt="Rainy Weather" />
            <h3>Rain Forecast</h3>
            <p>Rain prediction, humidity tracking & storm warnings.</p>
          </div>

          <div className="dashboard-card fade-in-up">
            <img src={clouds} alt="Cloudy Weather" />
            <h3>Cloud Coverage</h3>
            <p>Sky visibility & cloud movement patterns.</p>
          </div>

          <div className="dashboard-card fade-in-up">
            <img src={storm} alt="Storm Alerts" />
            <h3>Storm Alerts</h3>
            <p>Real-time thunderstorm and severe weather alerts.</p>
          </div>

          <div className="dashboard-card fade-in-up">
            <img src={wind} alt="Wind Updates" />
            <h3>Wind Patterns</h3>
            <p>Track wind speed and direction for outdoor planning.</p>
          </div>

        </div>
      </section>

      {/* ===== Info Section ===== */}
      <section className="info-section fade-in-up">
        <h2>Why Our WeatherApp?</h2>
        <p className="info-desc">
          Real-time, fast & precise weather data powered by modern forecasting engines.
        </p>

        <div className="info-cards">
          <div className="info-card">
            <i className="fa-solid fa-location-crosshairs info-icon"></i>
            <h3>Live Location Forecast</h3>
          </div>

          <div className="info-card">
            <i className="fa-solid fa-cloud-sun info-icon"></i>
            <h3>7-Day Forecast</h3>
          </div>

          <div className="info-card">
            <i className="fa-solid fa-bell info-icon"></i>
            <h3>Severe Alerts</h3>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section fade-in-up">
        <div className="cta-content">
          <h2>Live Weather API Integration Coming Soon</h2>
          <button className="cta-btn">Stay Tuned</button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
