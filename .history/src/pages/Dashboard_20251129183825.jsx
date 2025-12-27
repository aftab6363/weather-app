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
  const [favoriteCities, setFavoriteCities] = useState([]); // For future use
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  // Get logged user data
  const rawStored = localStorage.getItem("loggedUser") || localStorage.getItem("user");
  const user = rawStored ? JSON.parse(rawStored) : null;

  // ===============================
  // FETCH SAVED CITIES
  // ===============================
  const fetchSavedCities = async () => {
    setLoadingCities(true);
    setCitiesError("");

    const userId = user?._id || user?.id;
    if (!userId) {
      setCitiesError("User not logged in");
      setLoadingCities(false);
      return;
    }

    const normalize = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (data.cities && Array.isArray(data.cities)) return data.cities;
      return [];
    };

    try {
      let res = await fetch(`http://localhost:5000/api/favorite-cities/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const list = normalize(data);
        await fetchWeatherForCities(list);
        setSavedCities(list);
        setLoadingCities(false);
        return;
      }

      res = await fetch("http://localhost:5000/api/favorite-cities/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      const list = normalize(data);
      await fetchWeatherForCities(list);
      setSavedCities(list);
    } catch (err) {
      console.error("Fetch cities error:", err);
      setCitiesError("Failed to load saved cities");
    } finally {
      setLoadingCities(false);
    }
  };

  // ===============================
  // FETCH WEATHER FOR EACH SAVED CITY
  // ===============================
  const fetchWeatherForCities = async (cities) => {
    const apiKey = "YOUR_OPENWEATHER_API_KEY"; // Replace your key here

    const updated = await Promise.all(
      cities.map(async (c) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${c.cityName}&appid=${apiKey}&units=metric`
          );
          const w = await res.json();

          return {
            ...c,
            temp: w.main?.temp,
            condition: w.weather?.[0]?.main,
            icon: w.weather?.[0]?.icon,
          };
        } catch {
          return { ...c, temp: null, condition: null, icon: null };
        }
      })
    );

    setSavedCities(updated);
  };

  // ===============================
  // REMOVE CITY
  // ===============================
  const removeCity = async (cityId) => {
    if (!window.confirm("Are you sure you want to unsave this city?")) return;

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
      alert(err.message);
    }
  };

  // ===============================
  // MAIN USE EFFECT
  // ===============================
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setUserName(user.email || user.username || "");
    setLastLogin(user.lastLogin || "");

    const fetchUsersCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/count");
        const data = await res.json();
        if (data.success) setTotalUsers(data.count);
      } catch {}
    };

    fetchUsersCount();
    fetchSavedCities();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const goToDetails = (cityName) => navigate(`/weather-details/${cityName}`);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // =====================================================
  // RETURN UI
  // =====================================================
  return (
    <div className="dashboard-container">
      {/* ORBS */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* SIDEBAR */}
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
            <span className="menu-icon">👤</span> Profile
          </li>

          <li className="menu-item">
            <span className="menu-icon">⚙️</span> Settings
          </li>

          <li className="menu-item" onClick={() => navigate("/")}>
            <span className="menu-icon">🌤️</span> Weather Search
          </li>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="header-section">
          <div>
            <h1 className="welcome">
              Welcome back, <span className="user-name">{(userName || "").split("@")[0]}</span> 👋
            </h1>
            <p className="subtitle">Your personalized weather dashboard.</p>
          </div>

          <div className="time-widget">
            <div className="time-display">{formatTime(currentTime)}</div>
            <div className="date-display">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="cards-row">
          <div className="card card-users">
            <div className="card-icon">👥</div>
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{totalUsers}</p>
          </div>

          <div className="card card-login">
            <div className="card-icon">🕐</div>
            <h3 className="card-title">Last Login</h3>
            <p className="card-value">{lastLogin || "Unknown"}</p>
          </div>

          <div className="card card-searches" onClick={() => navigate("/")}>
            <div className="card-icon">🔍</div>
            <h3 className="card-title">Search Weather</h3>
            <p className="card-value">Click to search</p>
          </div>
        </div>

        {/* ========================== */}
        {/* SAVED CITIES SECTION      */}
        {/* ========================== */}
        <div className="saved-cities-section">
          <h2>Saved Cities</h2>

          {loadingCities ? (
            <p>Loading saved cities...</p>
          ) : citiesError ? (
            <p className="error-text">{citiesError}</p>
          ) : savedCities.length === 0 ? (
            <p>No saved cities yet.</p>
          ) : (
            <div className="cities-grid">
              {savedCities.map((city) => (
                <div
                  key={city._id}
                  className="city-card"
                  onClick={() => goToDetails(city.cityName)}
                >
                  <div className="city-left">
                    <h3 className="city-name">{city.customName || city.cityName}</h3>
                    <p className="city-condition">{city.condition || "—"}</p>
                    <p className="city-temp">
                      {city.temp !== null ? `${Math.round(city.temp)}°C` : "—"}
                    </p>
                  </div>

                  {city.icon ? (
                    <img
                      className="city-icon"
                      src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
                      alt=""
                    />
                  ) : (
                    <div className="city-icon placeholder">🌥️</div>
                  )}

                  <button
                    className="city-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevents card click
                      removeCity(city._id);
                    }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAVORITE CITIES (Future Expansion) */}
        <div className="favorite-cities-section">
          <h2>Favorite Cities</h2>
          <p>(Coming soon — based on user favorites selection)</p>
        </div>
      </main>
    </div>
  );
}
