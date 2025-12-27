import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastLogin, setLastLogin] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [savedCities, setSavedCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  // Accept either key ("loggedUser" used by dashboard earlier, or "user" used by login.jsx)
  const rawStored = localStorage.getItem("loggedUser") || localStorage.getItem("user");
  const user = rawStored ? JSON.parse(rawStored) : null;

  // Fetch user's saved cities (tries GET first, then falls back to older POST route)
  const fetchSavedCities = async () => {
    setLoadingCities(true);
    setCitiesError("");

    const userId = user?._id || user?.id;
    if (!userId) {
      setCitiesError("User not logged in");
      setLoadingCities(false);
      return;
    }

    // Helper to normalize response to an array of cities
    const normalize = (data) => {
      // backend responses we've seen:
      // { success: true, cities: [...] }
      // or directly an array [...]
      // or { success: true, city: {...} } for single
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (data.cities && Array.isArray(data.cities)) return data.cities;
      // maybe data is { success: true, data: [...] }
      if (data.data && Array.isArray(data.data)) return data.data;
      return [];
    };

    try {
      // Try GET /favorite-cities/:userId (if routes were changed)
      let res = await fetch(`http://localhost:5000/api/favorite-cities/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSavedCities(normalize(data));
        setLoadingCities(false);
        return;
      }

      // If GET failed (404/other), fallback to POST /favorite-cities/get
      // (some deployments still use POST body { userId })
      res = await fetch("http://localhost:5000/api/favorite-cities/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const fallbackData = await res.json();
      if (!res.ok) throw new Error(fallbackData.error || "Failed to fetch cities");
      setSavedCities(normalize(fallbackData));
    } catch (err) {
      console.error("fetchSavedCities error:", err);
      setCitiesError(err.message || "Failed to load saved cities");
    } finally {
      setLoadingCities(false);
    }
  };

  // Remove a city
  const removeCity = async (cityId) => {
    if (!window.confirm("Are you sure you want to remove this city?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/favorite-cities/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove city");

      setSavedCities((prev) => prev.filter((c) => c._id !== cityId));
    } catch (err) {
      console.error("removeCity error:", err);
      alert(err.message || "Could not remove city");
    }
  };

  useEffect(() => {
    // if no user found in either key, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // set basic UI fields safely
    setUserName(user.email || user.name || user.username || "");
    setLastLogin(user.lastLogin || "");

    // fetch stats and saved cities
    const fetchUsersCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/count");
        const data = await response.json();
        if (data && data.success) setTotalUsers(data.count || 0);
      } catch (err) {
        console.log("Error fetching users count", err);
      }
    };

    fetchUsersCount();
    fetchSavedCities();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const handleLogout = () => {
    // clear both possible keys so future logins are clean
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🌤️</div>
            <h2 className="sidebar-title">Weather Panel</h2>
          </div>
        </div>

        <nav className="menu-list">
          <li className="menu-item active">
            <span className="menu-icon">🏠</span>
            <span className="menu-text">Dashboard</span>
            <div className="active-indicator"></div>
          </li>
          <li className="menu-item">
            <span className="menu-icon">👤</span>
            <span className="menu-text">Profile</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Settings</span>
          </li>
          <li className="menu-item" onClick={() => navigate("/")}>
            <span className="menu-icon">🌤️</span>
            <span className="menu-text">Weather Search</span>
          </li>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="welcome-area">
            <h1 className="welcome">
              Welcome back, <span className="user-name">{(userName || "").split("@")[0]}</span> 👋
            </h1>
            <p className="subtitle">Your personalized weather dashboard with real-time insights.</p>
          </div>

          <div className="time-widget">
            <div className="time-display">{formatTime(currentTime)}</div>
            <div className="date-display">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="cards-row">
          <div className="card card-users">
            <div className="card-icon-wrapper">
              <div className="card-icon">👥</div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Total Users</h3>
              <p className="card-value">{totalUsers}</p>
              <div className="card-trend"><span className="trend-up">↗ 12% this month</span></div>
            </div>
            <div className="card-glow card-glow-blue"></div>
          </div>

          <div className="card card-login">
            <div className="card-icon-wrapper">
              <div className="card-icon">🕐</div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Last Login</h3>
              <p className="card-value last-login-value">{lastLogin || "Not Recorded"}</p>
              <div className="card-trend"><span className="trend-neutral">● Active now</span></div>
            </div>
            <div className="card-glow card-glow-purple"></div>
          </div>

          <div className="card card-searches" onClick={() => navigate("/")}>
            <div className="card-icon-wrapper"><div className="card-icon">🔍</div></div>
            <div className="card-content">
              <h3 className="card-title">Search Weather</h3>
              <p className="card-value"><span className="coming-soon">Click to search cities</span></p>
              <div className="card-trend"><span className="trend-neutral">● Real-time Weather</span></div>
            </div>
            <div className="card-glow card-glow-orange"></div>
          </div>
        </div>

        {/* Saved Cities Section */}
        <div className="saved-cities-section">
          <h2>Favorite Cities</h2>
          {loadingCities ? (
            <p>Loading saved cities...</p>
          ) : citiesError ? (
            <p className="error-text">{citiesError}</p>
          ) : savedCities.length === 0 ? (
            <p>No cities saved yet.</p>
          ) : (
            <div className="cities-grid">
              {savedCities.map((city) => (
                <div key={city._id} className="city-card">
                  <span className="city-name">{city.customName || city.cityName}</span>
                  <div className="city-actions">
                    <button className="remove-btn" onClick={() => removeCity(city._id)}>❌ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
