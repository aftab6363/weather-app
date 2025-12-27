import React, { useEffect } from "react";
import "../styles/services.css";

const sunny = "/assets/sunny.jpg";
const rain = "/assets/rainy.jpg";
const clouds = "/assets/cloudy.jpg";
const storm = "/assets/storm.jpg";
const wind = "/assets/wind.jpg";


function Services() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Enhanced Intersection Observer with stagger effect
    const elements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100); // Stagger animation
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    // Parallax effect for header
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const header = document.querySelector(".services-header");
      if (header) {
        header.style.transform = `translateY(${scrolled * 0.4}px)`;
        header.style.opacity = `${1 - scrolled * 0.002}`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="services-page">
      {/* ===== Page Header with Glassmorphism ===== */}
      <section className="services-header fade-in-up">
        <div className="header-glass-container">
          <h1>Our Weather Services</h1>
          <p>
            Explore a range of weather solutions designed to keep you informed
            and prepared for every condition — anywhere, anytime.
          </p>
        </div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* ===== Service Cards with Enhanced Animations ===== */}
      <section className="services-section">
        <div className="services-cards">

          <div className="services-card fade-in-up">
            <div className="card-image-wrapper">
              <img src={sunny} alt="Sunny Weather" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-sun"></i>
              </div>
              <h3>Sunny Conditions</h3>
              <p>UV index, heat alerts & daylight temperature insights.</p>
            </div>
          </div>

          <div className="services-card fade-in-up">
            <div className="card-image-wrapper">
              <img src={rain} alt="Rainy Weather" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-cloud-rain"></i>
              </div>
              <h3>Rain Forecast</h3>
              <p>Rain prediction, humidity tracking & storm warnings.</p>
            </div>
          </div>

          <div className="services-card fade-in-up">
            <div className="card-image-wrapper">
              <img src={clouds} alt="Cloudy Weather" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-cloud"></i>
              </div>
              <h3>Cloud Coverage</h3>
              <p>Sky visibility & cloud movement patterns.</p>
            </div>
          </div>

          <div className="services-card fade-in-up">
            <div className="card-image-wrapper">
              <img src={storm} alt="Storm Alerts" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-cloud-bolt"></i>
              </div>
              <h3>Storm Alerts</h3>
              <p>Real-time thunderstorm and severe weather alerts.</p>
            </div>
          </div>

          <div className="services-card fade-in-up">
            <div className="card-image-wrapper">
              <img src={wind} alt="Wind Updates" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">
                <i className="fa-solid fa-wind"></i>
              </div>
              <h3>Wind Patterns</h3>
              <p>Track wind speed and direction for outdoor planning.</p>
            </div>
          </div>

        </div>
      </section>


      {/* ===== Info Section with Glassmorphism ===== */}
      <section className="info-section fade-in-up">
        <h2>Why Our WeatherApp?</h2>
        <p className="info-desc">
          Real-time, fast & precise weather data powered by modern forecasting
          engines.
        </p>

        <div className="info-cards">
          <div className="info-card fade-in-up">
            <div className="info-icon-wrapper">
              <i className="fa-solid fa-location-crosshairs info-icon"></i>
            </div>
            <h3>Live Location Forecast</h3>
            <p>Get accurate weather updates based on your exact location</p>
          </div>

          <div className="info-card fade-in-up">
            <div className="info-icon-wrapper">
              <i className="fa-solid fa-cloud-sun info-icon"></i>
            </div>
            <h3>7-Day Forecast</h3>
            <p>Plan ahead with detailed weekly weather predictions</p>
          </div>

          <div className="info-card fade-in-up">
            <div className="info-icon-wrapper">
              <i className="fa-solid fa-bell info-icon"></i>
            </div>
            <h3>Severe Alerts</h3>
            <p>Stay safe with instant notifications for extreme weather</p>
          </div>
        </div>
      </section>

      {/* ===== CTA Section with Advanced Glassmorphism ===== */}
      <section className="cta-section fade-in-up">
        <div className="cta-glass-container">
          <div className="cta-content">
            <h2>Live Weather API Integration Coming Soon</h2>
            <p>
              Experience the next generation of weather forecasting technology
            </p>
            <button className="cta-btn">
              <span>Stay Tuned</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="cta-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </section>
    </div>
  );
}

export default Services;