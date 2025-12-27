import React, { useEffect, useRef } from "react";
import "../styles/About.css";

// Import local images
const ShayanImage = "/assets/shayan.jpg";
const UzairImage = "/assets/Uzair.jpg";
const ZainImage = "/assets/Zain.jpg";

function About() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Smooth scroll observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="about-container">
      {/* Floating Background Elements */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="about-hero animate-on-scroll">
        <div className="hero-image-wrapper">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1200&q=80"
            alt="Weather Background"
            loading="lazy"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="title-word">About</span>
            <span className="title-word gradient-text">WeatherApp</span>
          </h1>
          <p className="hero-subtitle">
            Your trusted companion for real-time and accurate weather updates
            worldwide.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Live Updates</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">195+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission animate-on-scroll">
        <div className="card glass-card mission-card">
          <div className="card-icon-wrapper">
            <div className="icon-glow"></div>
            <i className="fas fa-globe-americas card-icon"></i>
          </div>
          <h2 className="card-title">
            <span className="icon-emoji">🌍</span> Our Mission
          </h2>
          <p className="card-description">
            To make weather data accessible, reliable, and easy to understand
            for everyone, anywhere in the world.
          </p>
          <div className="card-shine"></div>
        </div>

        <div className="card glass-card vision-card">
          <div className="card-icon-wrapper">
            <div className="icon-glow"></div>
            <i className="fas fa-lightbulb card-icon"></i>
          </div>
          <h2 className="card-title">
            <span className="icon-emoji">💡</span> Our Vision
          </h2>
          <p className="card-description">
            To be the go-to weather platform, combining technology and design to
            empower smarter daily decisions.
          </p>
          <div className="card-shine"></div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why animate-on-scroll">
        <h2 className="section-title">
          Why Choose <span className="gradient-text">WeatherApp?</span>
        </h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <div className="feature-content">
              <h3>Real-time Data</h3>
              <p>Lightning-fast updates every second</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <div className="feature-content">
              <h3>Beautiful Design</h3>
              <p>Stunning & responsive interface</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <div className="feature-content">
              <h3>Easy to Use</h3>
              <p>Intuitive navigation & controls</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="feature-content">
              <h3>Trusted APIs</h3>
              <p>Powered by industry leaders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team animate-on-scroll">
        <h2 className="section-title">
          Meet Our <span className="gradient-text">Team</span>
        </h2>
        <p className="section-subtitle">
          The talented individuals behind WeatherApp
        </p>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-wrapper">
                <img src={ShayanImage} alt="Shayan Ashfaq" loading="lazy" />
                <div className="team-overlay">
                  <div className="social-links">
                    <a href="#" className="social-icon" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Shayan Ashfaq</h3>
                <p className="team-role">Frontend Developer</p>
                <div className="team-skills">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">CSS</span>
                  <span className="skill-tag">UI/UX</span>
                </div>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-wrapper">
                <img src={ZainImage} alt="Zain Ali Yousaf" loading="lazy" />
                <div className="team-overlay">
                  <div className="social-links">
                    <a href="#" className="social-icon" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Zain Ali Yousaf</h3>
                <p className="team-role">Backend Developer + FULL STACK</p>
                <div className="team-skills">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">APIs</span>
                  <span className="skill-tag">Database</span>
                </div>
              </div>
            </div>
          </div>

          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-wrapper">
                <img src={UzairImage} alt="Uzair Ali" loading="lazy" />
                <div className="team-overlay">
                  <div className="social-links">
                    <a href="#" className="social-icon" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className="social-icon" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Uzair Ali</h3>
                <p className="team-role"></p>
                <div className="team-skills">
                  <span className="skill-tag">Leadership</span>
                  <span className="skill-tag">Strategy</span>
                  <span className="skill-tag">Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta animate-on-scroll">
        <div className="cta-glass-card">
          <h2 className="cta-title">Ready to Experience Better Weather?</h2>
          <p className="cta-text">
            Join thousands of users who trust WeatherApp for accurate forecasts
          </p>
          <button className="cta-button">
            <span>Get Started</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;