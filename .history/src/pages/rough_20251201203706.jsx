// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/weatherDetails.css";

// const WeatherDetails = () => {
//   const { city } = useParams();
//   const navigate = useNavigate();

//   const [forecast, setForecast] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchForecast = async (cityName) => {
//     try {
//       setLoading(true);
//       setError("");
//       setForecast([]);

//       const res = await fetch(
//         `http://localhost:5000/api/weather/5days/${encodeURIComponent(cityName)}`
//       );

//       if (!res.ok) {
//         let msg = `Status: ${res.status}`;
//         try {
//           const body = await res.json();
//           msg = body.message || body.error || msg;
//         } catch {}
//         throw new Error(msg);
//       }

//       const data = await res.json();

//       if (!data || !Array.isArray(data)) {
//         throw new Error("Unexpected data format");
//       }

//       setForecast(data);
//     } catch (err) {
//       console.error("5-day forecast error:", err);
//       setError(err.message || "Failed to load forecast");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 REMOVE LOCAL ICON MAPPING — Not needed anymore

//   useEffect(() => {
//     if (city) fetchForecast(city);
//   }, [city]);

//   return (
//     <div className="weather-details-page">
//       <div className="weather-details-container">
//         <div className="summary-header">
//           <h1 className="summary-title">5-Day Weather Forecast</h1>
//           <p className="summary-city">{city}</p>
//         </div>

//         {loading && <div className="loading-text">Loading weather...</div>}
//         {error && <div className="error-text">{error}</div>}

//         {!loading && !error && forecast.length > 0 && (
//           <div className="forecast-section">
//             <div className="forecast-grid">
//               {forecast.map((item, index) => {
//                 const date = new Date(item.dt * 1000);
//                 const desc = item.weather?.description || "";
//                 const temp = Math.round(item.temp?.day || item.feels_like?.day);
//                 const humidity = item.humidity;
//                 const wind = item.wind_speed;

//                 // 🔥 USE OFFICIAL OPENWEATHER ICONS
//                 const iconUrl = `https://openweathermap.org/img/wn/${item.weather?.icon}@4x.png`;

//                 return (
//                   <div className="forecast-card" key={index}>
//                     <div className="forecast-day">
//                       {date.toLocaleDateString(undefined, {
//                         weekday: "short",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </div>

//                     {/* WEATHER ICON */}
//                     <img
//                       src={iconUrl}
//                       alt={desc}
//                       className="forecast-icon"
//                     />

//                     <div className="forecast-temp">{temp}°C</div>

//                     <div className="forecast-desc">{desc}</div>

//                     <div className="forecast-info">
//                       <p>Humidity: {humidity}%</p>
//                       <p>Wind: {wind} m/s</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <button className="back-btn" onClick={() => navigate(-1)}>
//               ← Back
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WeatherDetails;













// /* =============================
//    Weather Details - 5 Day UI
//    Glassmorphism + Dynamic BG
//    ============================= */

// /* --- Dynamic Backgrounds --- */
// .weather-details-page {
//     min-height: 100vh;
//     padding: 40px 20px;
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     transition: background-image 0.5s ease;
//   }
  
//   .clear-bg {
//     background: url("../assets/clear.jpg") center/cover no-repeat;
//   }
  
//   .cloud-bg {
//     background: url("../assets/clouds.jpg") center/cover no-repeat;
//   }
  
//   .rain-bg {
//     background: url("../assets/rain.jpg") center/cover no-repeat;
//   }
  
//   .storm-bg {
//     background: url("../assets/storm.jpg") center/cover no-repeat;
//   }
  
//   .snow-bg {
//     background: url("../assets/snow.jpg") center/cover no-repeat;
//   }
  
//   .default-bg {
//     background: url("../assets/hero_weather.jpg") center/cover no-repeat;
//   }
  
//   /* --- Main Container --- */
//   .weather-details-container {
//     width: 90%;
//     max-width: 1050px;
//     padding: 35px;
//     border-radius: 25px;
//     background: rgba(255, 255, 255, 0.12);
//     -webkit-backdrop-filter: blur(20px);
//     backdrop-filter: blur(20px);
//     border: 1px solid rgba(255, 255, 255, 0.25);
//     animation: fadeIn 1s ease;
//     box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
//   }
  
//   /* --- Summary Header --- */
//   .summary-header {
//     text-align: center;
//     margin-bottom: 28px;
//   }
  
//   .summary-title {
//     font-size: 34px;
//     font-weight: 700;
//     color: white;
//     text-shadow: 0 0 12px rgba(255,255,255,0.5);
//   }
  
//   .summary-city {
//     font-size: 20px;
//     color: #e8f7ff;
//     margin-top: 5px;
//   }
  
//   /* --- Forecast Section --- */
//   .forecast-section {
//     margin-top: 20px;
//   }
  
//   .forecast-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
//     gap: 20px;
//   }
  
//   /* --- Forecast Card --- */
//   .forecast-card {
//     padding: 22px;
//     border-radius: 18px;
//     background: rgba(255,255,255,0.15);
//     backdrop-filter: blur(10px);
//     border: 1px solid rgba(255,255,255,0.25);
//     text-align: center;
//     animation: fadeIn 0.8s ease, scaleIn 0.6s ease;
//     transition: transform 0.3s ease;
//   }
  
//   .forecast-card:hover {
//     transform: translateY(-7px) scale(1.06);
//   }
  
//   .forecast-day {
//     color: #dff6ff;
//     font-size: 18px;
//     font-weight: 600;
//   }
  
//   .forecast-icon {
//     width: 70px;
//     animation: iconFloat 3s infinite ease-in-out;
//   }
  
//   .forecast-temp {
//     margin: 5px 0;
//     font-size: 26px;
//     color: white;
//     font-weight: 700;
//   }
  
//   .forecast-desc {
//     font-size: 15px;
//     color: #d4efff;
//     margin-bottom: 10px;
//   }
  
//   .forecast-info p {
//     font-size: 14px;
//     color: #e8f8ff;
//     margin: 3px 0;
//   }
  
//   /* --- Back Button --- */
//   .back-btn {
//     margin-top: 30px;
//     padding: 12px 22px;
//     border-radius: 14px;
//     background: linear-gradient(120deg, #009dff, #7c5bff);
//     border: none;
//     color: white;
//     font-size: 16px;
//     cursor: pointer;
//     display: inline-block;
//     box-shadow: 0 8px 18px rgba(0,0,0,0.3);
//     transition: 0.3s ease;
//   }
  
//   .back-btn:hover {
//     transform: translateY(-3px);
//     opacity: 0.9;
//   }
  
//   /* --- Animations --- */
//   @keyframes fadeIn {
//     from {opacity: 0;}
//     to {opacity: 1;}
//   }
  
//   @keyframes scaleIn {
//     0% {transform: scale(0.7); opacity: 0;}
//     100% {transform: scale(1); opacity: 1;}
//   }
  
//   @keyframes iconFloat {
//     0% {transform: translateY(0);}
//     50% {transform: translateY(-6px);}
//     100% {transform: translateY(0);}
//   }
  




// Dashboard.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [userName, setUserName] = useState("");
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [lastLogin, setLastLogin] = useState("");
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const [savedCities, setSavedCities] = useState([]);
//   const [favoriteCities, setFavoriteCities] = useState([]);
//   const [loadingCities, setLoadingCities] = useState(true);
//   const [citiesError, setCitiesError] = useState("");

//   const rawStored = localStorage.getItem("loggedUser") || localStorage.getItem("user");
//   const user = rawStored ? JSON.parse(rawStored) : null;

//   // Fetch all favorite cities for the user
//   const fetchSavedCities = async () => {
//     setLoadingCities(true);
//     setCitiesError("");

//     const userId = user?._id || user?.id;
//     if (!userId) {
//       setCitiesError("User not logged in");
//       setLoadingCities(false);
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:5000/api/favorite-cities/${userId}`);
//       if (!res.ok) throw new Error("Failed to fetch cities");
//       const data = await res.json();
//       const cities = data.cities || [];

//       // Add default isFavorite false if not present
//       const normalized = cities.map(city => ({
//         ...city,
//         isFavorite: city.isFavorite ?? false // ensure boolean
//       }));

//       await fetchWeatherForCities(normalized);
//     } catch (err) {
//       console.error(err);
//       setCitiesError("Failed to load saved cities");
//     } finally {
//       setLoadingCities(false);
//     }
//   };

//   // Fetch weather data for cities
//   const fetchWeatherForCities = async (cities) => {
//     const apiKey = "3e40040b5295e90a19ae7ea070b7a7df"; // Replace with your API key
//     const updated = await Promise.all(
//       cities.map(async (c) => {
//         try {
//           const res = await fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=${c.cityName}&appid=${apiKey}&units=metric`
//           );
//           const w = await res.json();
//           return {
//             ...c,
//             temp: w.main?.temp ?? null,
//             condition: w.weather?.[0]?.main ?? "—",
//             icon: w.weather?.[0]?.icon ?? null,
//           };
//         } catch {
//           return { ...c, temp: null, condition: "—", icon: null };
//         }
//       })
//     );

//     // Separate favorites
//     setFavoriteCities(updated.filter(c => c.isFavorite));
//     setSavedCities(updated.filter(c => !c.isFavorite));
//   };

//   // Remove a city
//   const removeCity = async (cityId, type = "saved") => {
//     if (!window.confirm(`Are you sure you want to ${type === "saved" ? "unsave" : "remove from favorite"} this city?`)) return;

//     try {
//       const res = await fetch("http://localhost:5000/api/favorite-cities/delete", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ cityId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to remove city");

//       if (type === "saved") setSavedCities(prev => prev.filter(c => c._id !== cityId));
//       else setFavoriteCities(prev => prev.filter(c => c._id !== cityId));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // Toggle favorite and persist in database
//   const toggleFavorite = async (city) => {
//     const updatedCity = { ...city, isFavorite: !city.isFavorite };
  
//     try {
//       const res = await fetch("http://localhost:5000/api/favorite-cities/favorite", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ cityId: city._id, isFavorite: updatedCity.isFavorite }),
//       });
  
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to update favorite");
  
//       // Move city to correct section after success
//       if (updatedCity.isFavorite) {
//         setFavoriteCities(prev => [...prev, updatedCity]);
//         setSavedCities(prev => prev.filter(c => c._id !== city._id));
//       } else {
//         setSavedCities(prev => [...prev, updatedCity]);
//         setFavoriteCities(prev => prev.filter(c => c._id !== city._id));
//       }
//     } catch (err) {
//       console.error("Error updating favorite:", err);
//       alert("Failed to update favorite status");
//     }
//   };
  

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     setUserName(user.email || user.username || "");
//     setLastLogin(user.lastLogin || "");

//     const fetchUsersCount = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/user/count");
//         const data = await res.json();
//         if (data.success) setTotalUsers(data.count);
//       } catch {}
//     };

//     fetchUsersCount();
//     fetchSavedCities();

//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const goToDetails = (cityName) => navigate(`/weather-details/${cityName}`);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const formatTime = (date) =>
//     date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

//   const formatDate = (date) =>
//     date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

//   return (
//     <div className="dashboard-container">
//       <div className="background-animation">
//         <div className="gradient-orb orb-1"></div>
//         <div className="gradient-orb orb-2"></div>
//         <div className="gradient-orb orb-3"></div>
//       </div>

//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <div className="logo-container">
//             <div className="logo-icon">🌤️</div>
//             <h2 className="sidebar-title">Weather Panel</h2>
//           </div>
//         </div>
//         <nav className="menu-list">
//           <li className="menu-item active">
//             <span className="menu-icon">🏠</span>
//             <span className="menu-text">Dashboard</span>
//             <div className="active-indicator"></div>
//           </li>
//           <li className="menu-item">👤 Profile</li>
//           <li className="menu-item">⚙️ Settings</li>
//           <li className="menu-item" onClick={() => navigate("/")}>🌤️ Weather Search</li>
//         </nav>
//         <div className="sidebar-footer">
//           <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
//         </div>
//       </aside>

//       <main className="main-content">
//         <div className="header-section">
//           <div>
//             <h1 className="welcome">
//               Welcome back, <span className="user-name">{(userName || "").split("@")[0]}</span> 👋
//             </h1>
//             <p className="subtitle">Your personalized weather dashboard.</p>
//           </div>

//           <div className="time-widget">
//             <div className="time-display">{formatTime(currentTime)}</div>
//             <div className="date-display">{formatDate(currentTime)}</div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="cards-row">
//           <div className="card card-users">
//             <div className="card-icon">👥</div>
//             <h3 className="card-title">Total Users</h3>
//             <p className="card-value">{totalUsers}</p>
//           </div>

//           <div className="card card-login">
//             <div className="card-icon">🕐</div>
//             <h3 className="card-title">Last Login</h3>
//             <p className="card-value">{lastLogin || "Unknown"}</p>
//           </div>

//           <div className="card card-searches" onClick={() => navigate("/")}>
//             <div className="card-icon">🔍</div>
//             <h3 className="card-title">Search Weather</h3>
//             <p className="card-value">Click to search</p>
//           </div>
//         </div>

//         {/* FAVORITE CITIES */}
//         {favoriteCities.length > 0 && (
//           <div className="favorite-cities-section">
//             <h2>Favorite Cities</h2>
//             <div className="cities-grid">
//               {favoriteCities.map(city => (
//                 <div key={city._id} className="city-card" onClick={() => goToDetails(city.cityName)}>
//                   <h3 className="city-name">{city.customName || city.cityName}</h3>
//                   <p className="city-condition">{city.condition}</p>
//                   <p className="city-temp">{city.temp !== null ? `${Math.round(city.temp)}°C` : "—"}</p>
//                   {city.icon ? (
//                     <img className="city-icon" src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="" />
//                   ) : (
//                     <div className="city-icon placeholder">🌥️</div>
//                   )}
//                   <div className="city-actions">
//                     <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeCity(city._id, "favorite"); }}>Remove</button>
//                     <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(city); }}>Unfavorite</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* SAVED CITIES */}
//         <div className="saved-cities-section">
//           <h2>Saved Cities</h2>
//           {loadingCities ? <p>Loading saved cities...</p> :
//             citiesError ? <p className="error-text">{citiesError}</p> :
//             savedCities.length === 0 ? <p>No saved cities yet.</p> :
//             <div className="cities-grid">
//               {savedCities.map(city => (
//                 <div key={city._id} className="city-card" onClick={() => goToDetails(city.cityName)}>
//                   <h3 className="city-name">{city.customName || city.cityName}</h3>
//                   <p className="city-condition">{city.condition}</p>
//                   <p className="city-temp">{city.temp !== null ? `${Math.round(city.temp)}°C` : "—"}</p>
//                   {city.icon ? (
//                     <img className="city-icon" src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="" />
//                   ) : (
//                     <div className="city-icon placeholder">🌥️</div>
//                   )}
//                   <div className="city-actions">
//                     <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeCity(city._id); }}>Remove</button>
//                     <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleFavorite(city); }}>Add Favorite</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           }
//         </div>
//       </main>
//     </div>
//   );
// }
