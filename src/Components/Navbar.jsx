import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check for logged in user
    const checkUser = () => {
      const storedUser = localStorage.getItem("loggedUser") || localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage events (optional, good for multi-tab sync)
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Navbar background change on scroll
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Check if link is active
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Logo */}
        <Link href="/" className="logo" onClick={() => setIsOpen(false)}>
          <i className="fa-solid fa-cloud-sun"></i>
          <span>WeatherApp</span>
        </Link>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li>
            <Link
              href="/"
              className={isActive("/") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={isActive("/about") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={isActive("/services") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={isActive("/contact") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>

          {/* Buttons or User Profile */}
          {user ? (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className="nav-btn login-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mobile-buttons">
                <button
                  className="nav-btn register-btn"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="mobile-buttons">
                <Link
                  href="/registration"
                  className="nav-btn register-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Register</span>
                </Link>
              </li>
              <li className="mobile-buttons">
                <Link
                  href="/login"
                  className="nav-btn login-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>



        {/* Mobile Menu Icon */}
        <div
          className={`menu-icon ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
        >
          <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </div>
      </nav>

      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </>
  );
}

export default Navbar;