import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo / Brand */}
      <div className="nav-brand">
        <i className="fa-solid fa-cloud-sun"></i>
        <span >Smart Weather App</span>
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        <li><Link to="/register" className="btn register-btn">Register</Link></li>
        <li><Link to="/login" className="btn login-btn">Login</Link></li>
      </ul>

      {/* Hamburger Icon (Mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="fa-solid fa-bars"></i>
      </div>

    </nav>
  );
}
