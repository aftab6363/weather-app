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
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const rawStored = localStorage.getItem("loggedUser") || localStorage.getItem("user");
  const user = rawStored ? JSON.parse(rawStored) : null;

  // Fetch all favorite cities for the user
  const fetchSavedCities = async () => {
    setLoadingCities(true);
    setCitiesError("");

    const userId = user?._id || user?.id;
    if (!userId) {
      setCitiesError("User not logged in");
      setLoadingCities(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/favorite-cities/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      const cities = data.cities || [];

      // Add default isFavorite false if not present
      const normalized = cities.map(city => ({
        ...city,
        isFavorite: city.isFavorite ?? false // ensure boolean
      }));

      await fetchWeatherForCities(normalized);
    } catch (err) {
      console.error(err);
      setCitiesError("Failed to load saved cities");
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch weather data for cities
  const fetchWeatherForCities = async (cities) => {
    const apiKey = "3e40040b5295e90a19ae7ea070b7a7df"; // Replace with your API key
    const updated = await Promise.all(
      cities.map(async (c) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${c.cityName}&appid=${apiKey}&units=metric`
          );
          const w = await res.json();
          return {
            ...c,
            temp: w.main?.temp ?? null,
            condition: w.weather?.[0]?.main ?? "—",
            icon: w.weather?.[0]?.icon ?? null,
          };
        } catch {
          return { ...c, temp: null, condition: "—", icon: null };
        }
      })
    );

    // Separate favorites
    setFavoriteCities(updated.filter(c => c.isFavorite));
    setSavedCities(updated.filter(c => !c.isFavorite));
  };

  // Remove a city
  const removeCity = async (cityId, type = "saved") => {
    if (!window.confirm(`Are you sure you want to ${type === "saved" ? "unsave" : "remove from favorite"} this city?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/favorite-cities/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove city");

      if (type === "saved") setSavedCities(prev => prev.filter(c => c._id !== cityId));
      else setFavoriteCities(prev => prev.filter(c => c._id !== cityId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle favorite and persist in database
  const toggleFavorite = async (city) => {
    const updatedCity = { ...city, isFavorite: !city.isFavorite };

    try {
      await fetch("http://localhost:5000/api/favorite-cities/favorite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId: city._id, isFavorite: updatedCity.isFavorite }),
      });

      // Update UI after backend success
      if (updatedCity.isFavorite) {
        setFavoriteCities(prev => [...prev, updatedCity]);
        setSavedCities(prev => prev.filter(c => c._id !== city._id));
      } else {
        setSavedCities(prev => [...prev, updatedCity]);
        setFavoriteCities(prev => prev.filter(c => c._id !== city._id));
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

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
    date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="dashboard-container">
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

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
          <li className="menu-item">👤 Profile</li>
          <li className="menu-item">⚙️ Settings</li>
          <li className="menu-item" onClick={() => navigate("/")}>🌤️ Weather Search</li>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

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

        {/* Stats Cards */}
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

        {/* FAVORITE CITIES */}
        {favoriteCities.length > 0 && (
          <div className="favorite-cities-section">
            <h2>Favorite Cities</h2>
            <div className="cities-grid">
              {favoriteCities.map(city => (
                <div key={city._id} className="city-card" onClick={() => goToDetails(city.cityName)}>
                  <h3 className="city-name">{city.customName || city.cityName}</h3>
                  <p className="city-condition">{city.condition}</p>
                  <p className="city-temp">{city.temp !== null ? `${Math.round(city.temp)}°C` : "—"}</p>
                  {city.icon ? (
                    <img className="city-icon" src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="" />
                  ) : (
                    <div className="city-icon placeholder">🌥️</div>
                  )}
                  <div className="city-actions">
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeCity(city._id, "favorite"); }}>Remove</button>
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(city); }}>Unfavorite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAVED CITIES */}
        <div className="saved-cities-section">
          <h2>Saved Cities</h2>
          {loadingCities ? <p>Loading saved cities...</p> :
            citiesError ? <p className="error-text">{citiesError}</p> :
            savedCities.length === 0 ? <p>No saved cities yet.</p> :
            <div className="cities-grid">
              {savedCities.map(city => (
                <div key={city._id} className="city-card" onClick={() => goToDetails(city.cityName)}>
                  <h3 className="city-name">{city.customName || city.cityName}</h3>
                  <p className="city-condition">{city.condition}</p>
                  <p className="city-temp">{city.temp !== null ? `${Math.round(city.temp)}°C` : "—"}</p>
                  {city.icon ? (
                    <img className="city-icon" src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="" />
                  ) : (
                    <div className="city-icon placeholder">🌥️</div>
                  )}
                  <div className="city-actions">
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeCity(city._id); }}>Remove</button>
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(city); }}>Add Favorite</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </main>
    </div>
  );
}
