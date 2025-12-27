import React, { useEffect } from "react";
import heroImage from "../assets/hero_weather.jpg";
import heroBg from "../assets/hero.jpg";
import islamabad from "../assets/islamabad.jpg";
import london from "../assets/london.jpg";
import beijing from "../assets/beijing.jpg";
import dubai from "../assets/dubai.jpg";
import "../styles/home.css";


const Home = () => {
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
    <>
      {/* ===== Hero Section ===== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-left">
              <h1 className="fade-in">
                Welcome to <span className="highlight">Smart WeatherAPP</span>
              </h1>
              <p className="fade-in-delay">
                Get precise, real-time weather updates from across the world.
                Whether it’s rain, shine, or storms — we’ve got you covered with
                instant forecasts and detailed climate insights.
              </p>
              <button className="hero-btn fade-in-delay2">Check Weather</button>
              <div className="weather-search fade-in-delay3">
                <input
                type="text"
                placeholder="Search city weather..."
                className="weather-input"
                />
                <button className="weather-search-btn">Search</button>
              </div>

            </div>

            <div className="hero-right fade-in-right">
              <img src={heroImage} alt="Weather Illustration" />
            </div>
          </div>
        </div>
      </section>


      {/* ===== Featured Cities Weather Section ===== */}
      <section className="cities-weather fade-in-up">
        <h2 className="section-title">Live City Weather (Demo)</h2>
        <p className="section-subtitle">
          Here’s a quick look at current conditions in some major cities.
        </p>

        <div className="cities-grid">
          {/* City 1 */}
          <div className="city-card">
            <img src={islamabad} alt="Karachi" className="city-img" />
            <div className="city-info">
              <h3>Islamabad</h3>
              <p>☀️ 34°C | Humidity: 60%</p>
              <p>UV Index: 7 (High)</p>
            </div>
          </div>

          {/* City 2 */}
          <div className="city-card">
            <img src={london} alt="Lahore" className="city-img" />
            <div className="city-info">
              <h3>London</h3>
              <p>🌤 31°C | Humidity: 55%</p>
              <p>UV Index: 6 (Moderate)</p>
            </div>
          </div>

          {/* City 3 */}
          <div className="city-card">
            <img src={beijing} alt="Islamabad" className="city-img" />
            <div className="city-info">
              <h3>Beijing</h3>
              <p>⛅ 28°C | Humidity: 68%</p>
              <p>UV Index: 5 (Moderate)</p>
            </div>
          </div>

          {/* City 4 */}
          <div className="city-card">
            <img src={dubai} alt="London" className="city-img" />
            <div className="city-info">
              <h3>Dubai</h3>
              <p>🌧 19°C | Humidity: 75%</p>
              <p>UV Index: 2 (Low)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Future API Section ===== */}
      <section className="future-api fade-in-up">
        <h2>Upcoming Feature: Real Weather API</h2>
        <p>
          Soon, this section will display <strong>real-time weather updates</strong> fetched
          directly from an API — including live temperature, humidity, wind, and more
          from cities around the globe.
        </p>
        <button className="api-btn">Coming Soon</button>
      </section>
    </>
  );
};

export default Home;
