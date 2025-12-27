import { useState, useEffect } from "react";
import heroImage from "../assets/hero_weather.jpg";
import heroBg from "../assets/hero.jpg";
import islamabad from "../assets/islamabad.jpg";
import london from "../assets/london.jpg";
import beijing from "../assets/beijing.jpg";
import dubai from "../assets/dubai.jpg";
import "../styles/home.css";

const Home = () => {
  const [city, setCity] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // New state for weather
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const fetchWeather = async (q) => {
    if (!q || q.trim() === "") return;
  
    setWeatherError("");
    setLoadingWeather(true);
    setWeatherData(null);
  
    try {
      // Use full backend URL
      const res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(q)}`);
  
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Status ${res.status}`);
      }
  
      const data = await res.json();
  
      const normalized = {
        city: `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`,
        temp: data.main?.temp,
        feels_like: data.main?.feels_like,
        humidity: data.main?.humidity,
        wind: data.wind?.speed,
        description: data.weather && data.weather[0] ? data.weather[0].description : "",
        icon:
          data.weather && data.weather[0]
            ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            : null,
        raw: data,
      };
  
      setWeatherData(normalized);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setWeatherError(err.message || "Failed to load weather");
    } finally {
      setLoadingWeather(false);
    }
  };
  

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city.trim());
      // keep city in input so user can edit — do not clear automatically
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll animations
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .fade-in, .fade-in-right"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  // Floating animation for weather icons
  useEffect(() => {
    const floatingElements = document.querySelectorAll(".floating");
    floatingElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  // Save city placeholder (UI only for now)
  const handleSaveCity = () => {
    // Placeholder — implement POST /api/cities when ready
    if (!weatherData) return;
    alert(`Saved city: ${weatherData.city}`);
  };

  return (
    <>
      {/* ===== Animated Background Particles ===== */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* ===== Hero Section with Premium Glassmorphism ===== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay">
          {/* Animated gradient orbs */}
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>

          <div className="hero-content">
            <div className="hero-left">
              {/* Premium Badge */}
              <div className="premium-badge fade-in">
                <span className="badge-icon">⚡</span>
                <span>Premium Weather Intelligence</span>
              </div>

              <h1 className="fade-in hero-title">
                Welcome to{" "}
                <span className="highlight gradient-text">Smart WeatherAPP</span>
              </h1>

              <p className="fade-in-delay hero-description">
                Experience the future of weather forecasting with AI-powered predictions,
                real-time updates, and stunning visual insights from across the globe.
              </p>

              {/* ===== PREMIUM GLASSMORPHIC SEARCH BAR ===== */}
              <div className="search-container fade-in-delay2">
                <div className="search-bar-premium">
                  <div className="search-icon" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search any city worldwide..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="City name"
                  />
                  <button onClick={handleSearch} className="search-btn-premium" aria-label="Search weather">
                    <span>Search</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Quick access chips */}
                <div className="quick-cities">
                  <span
                    className="quick-chip"
                    onClick={() => {
                      setCity("New York");
                      fetchWeather("New York");
                    }}
                  >
                    🗽 New York
                  </span>
                  <span
                    className="quick-chip"
                    onClick={() => {
                      setCity("Tokyo");
                      fetchWeather("Tokyo");
                    }}
                  >
                    🗼 Tokyo
                  </span>
                  <span
                    className="quick-chip"
                    onClick={() => {
                      setCity("Paris");
                      fetchWeather("Paris");
                    }}
                  >
                    🗼 Paris
                  </span>
                </div>

                {/* ===== WEATHER RESULT (inserted here) ===== */}
                <div className="weather-result" aria-live="polite">
                  {loadingWeather && (
                    <div className="weather-loader">
                      <div className="spinner" role="status" aria-hidden></div>
                      <div className="loader-text">Fetching weather...</div>
                    </div>
                  )}

                  {weatherError && !loadingWeather && (
                    <div className="weather-error glass" role="alert">
                      <strong>Error:</strong> {weatherError}
                    </div>
                  )}

                  {weatherData && !loadingWeather && (
                    <div className="weather-card glass fade-in" role="region" aria-label={`Weather for ${weatherData.city}`}>
                      <div className="weather-main">
                        <div className="weather-left">
                          {weatherData.icon && (
                            <img src={weatherData.icon} alt={`${weatherData.description} icon`} className="weather-icon floating" />
                          )}
                        </div>

                        <div className="weather-center">
                          <div className="weather-city">{weatherData.city}</div>
                          <div className="weather-temp">{Math.round(weatherData.temp)}°C</div>
                          <div className="weather-desc">{weatherData.description}</div>
                        </div>

                        <div className="weather-right">
                          <div className="weather-meta">
                            <div className="meta-row"><span>Feels</span><strong>{Math.round(weatherData.feels_like)}°C</strong></div>
                            <div className="meta-row"><span>Humidity</span><strong>{weatherData.humidity}%</strong></div>
                            <div className="meta-row"><span>Wind</span><strong>{weatherData.wind} m/s</strong></div>
                          </div>
                        </div>
                      </div>

                      <div className="weather-actions">
                        <button className="city-details-btn" onClick={() => fetchWeather(weatherData.city.split(",")[0])}>
                          Refresh
                        </button>

                        <button className="save-btn" onClick={handleSaveCity} aria-label="Save city to favorites">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="stats-row fade-in-delay3">
                <div className="stat-card glass">
                  <div className="stat-icon">🌍</div>
                  <div className="stat-content">
                    <div className="stat-value">195+</div>
                    <div className="stat-label">Countries</div>
                  </div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-value">99.9%</div>
                    <div className="stat-label">Accuracy</div>
                  </div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <div className="stat-value">Real-time</div>
                    <div className="stat-label">Updates</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-right fade-in-right">
              <div
                className="hero-image-container"
                style={{
                  transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                }}
              >
                <div className="image-glow"></div>
                <img src={heroImage} alt="Weather Illustration" className="hero-img" />

                {/* Floating weather widgets */}
                <div className="floating-widget widget-1 glass floating">
                  <div className="widget-icon">☀️</div>
                  <div className="widget-text">
                    <div className="widget-value">28°C</div>
                    <div className="widget-label">Sunny</div>
                  </div>
                </div>

                <div className="floating-widget widget-2 glass floating">
                  <div className="widget-icon">💨</div>
                  <div className="widget-text">
                    <div className="widget-value">12 km/h</div>
                    <div className="widget-label">Wind Speed</div>
                  </div>
                </div>

                <div className="floating-widget widget-3 glass floating">
                  <div className="widget-icon">💧</div>
                  <div className="widget-text">
                    <div className="widget-value">65%</div>
                    <div className="widget-label">Humidity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Premium Featured Cities Section ===== */}
      <section className="cities-weather">
        <div className="section-header fade-in-up">
          <div className="section-badge">
            <span className="badge-dot"></span>
            <span>Live Weather Data</span>
          </div>
          <h2 className="section-title gradient-text">Global Weather Insights</h2>
          <p className="section-subtitle">
            Real-time weather conditions from major cities around the world
          </p>
        </div>

        <div className="cities-grid">
          {[
            { name: "Islamabad", temp: "34°C", condition: "☀️ Sunny", humidity: "60%", uv: "7", img: islamabad, delay: "0s" },
            { name: "London", temp: "31°C", condition: "🌤 Partly Cloudy", humidity: "55%", uv: "6", img: london, delay: "0.1s" },
            { name: "Beijing", temp: "28°C", condition: "⛅ Cloudy", humidity: "68%", uv: "5", img: beijing, delay: "0.2s" },
            { name: "Dubai", temp: "19°C", condition: "🌧 Rainy", humidity: "75%", uv: "2", img: dubai, delay: "0.3s" }
          ].map((city, index) => (
            <div
              key={index}
              className="city-card-premium glass scale-in"
              style={{ animationDelay: city.delay }}
            >
              <div className="city-image-wrapper">
                <img src={city.img} alt={city.name} className="city-img-premium" />
                <div className="city-overlay"></div>
                <div className="city-badge">{city.condition}</div>
              </div>

              <div className="city-content">
                <div className="city-header">
                  <h3 className="city-name">{city.name}</h3>
                  <div className="city-temp">{city.temp}</div>
                </div>

                <div className="city-stats">
                  <div className="city-stat">
                    <span className="stat-icon-small">💧</span>
                    <span className="stat-text">Humidity: {city.humidity}</span>
                  </div>
                  <div className="city-stat">
                    <span className="stat-icon-small">☀️</span>
                    <span className="stat-text">UV Index: {city.uv}</span>
                  </div>
                </div>

                <button className="city-details-btn">
                  <span>View Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Animated corner accent */}
              <div className="card-accent"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Premium Features Section ===== */}
      <section className="features-section fade-in-up">
        <div className="features-grid">
          <div className="feature-card glass slide-in-left">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🎯</div>
            </div>
            <h3 className="feature-title">Hyper-Accurate Forecasts</h3>
            <p className="feature-description">
              AI-powered predictions with 99.9% accuracy using advanced meteorological algorithms
            </p>
          </div>

          <div className="feature-card glass slide-in-left" style={{ animationDelay: "0.1s" }}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">⚡</div>
            </div>
            <h3 className="feature-title">Lightning-Fast Updates</h3>
            <p className="feature-description">
              Real-time weather data refreshed every minute for instant accuracy
            </p>
          </div>

          <div className="feature-card glass slide-in-left" style={{ animationDelay: "0.2s" }}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🌐</div>
            </div>
            <h3 className="feature-title">Global Coverage</h3>
            <p className="feature-description">
              Access weather data from over 200,000 cities across 195 countries
            </p>
          </div>
        </div>
      </section>

      {/* ===== Future API Section with Premium Design ===== */}
      <section className="future-api fade-in-up">
        <div className="api-container">
          <div className="api-content">
            <div className="api-badge glass">
              <span className="pulse-dot"></span>
              <span>Coming Soon</span>
            </div>

            <h2 className="api-title">
              Next-Generation <span className="gradient-text">Weather API</span>
            </h2>

            <p className="api-description">
              Get ready for our revolutionary weather API with machine learning predictions,
              climate change analytics, and satellite imagery integration.
            </p>

            <div className="api-features">
              <div className="api-feature-item">
                <span className="check-icon">✓</span>
                <span>15-Day Advanced Forecasts</span>
              </div>
              <div className="api-feature-item">
                <span className="check-icon">✓</span>
                <span>Severe Weather Alerts</span>
              </div>
              <div className="api-feature-item">
                <span className="check-icon">✓</span>
                <span>Historical Data Analysis</span>
              </div>
            </div>

            <button className="api-btn-premium glass">
              <span>Join Waitlist</span>
              <div className="btn-shimmer"></div>
            </button>
          </div>

          <div className="api-visual">
            <div className="api-mockup glass">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="code-line"><span className="code-key">GET</span> /api/weather/forecast</div>
                <div className="code-line"><span className="code-key">Response:</span> 200 OK</div>
                <div className="code-line">{"{"}</div>
                <div className="code-line indent">"temperature": <span className="code-value">28°C</span>,</div>
                <div className="code-line indent">"conditions": <span className="code-value">"sunny"</span>,</div>
                <div className="code-line indent">"accuracy": <span className="code-value">99.9%</span></div>
                <div className="code-line">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
