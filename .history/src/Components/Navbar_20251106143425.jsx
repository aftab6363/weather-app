import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1><i className="fa-solid fa-cloud-sun"></i> Smart WeatherApp</h1>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Show Home when NOT logged in */}
        {!isLoggedIn && <Link to="/">Home</Link>}

        {/* Dashboard is visible only when logged in */}
        {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}

        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>

        {/* Show Register & Login only when NOT logged in */}
        {!isLoggedIn && (
          <>
            <Link to="/registration" className="nav-btn register-btn">Register</Link>
            <Link to="/login" className="nav-btn login-btn">Login</Link>
          </>
        )}

        {/* Show Logout only when logged in */}
        {isLoggedIn && (
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* Hamburger Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </div>
    </nav>
  );
}

export default Navbar;
