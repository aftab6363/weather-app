"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../src/styles/dashboard.css";

export default function Dashboard() {
    const router = useRouter(); // navigate -> router

    const [userName, setUserName] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastLogin, setLastLogin] = useState("");
    const [currentTime, setCurrentTime] = useState(null);

    const [savedCities, setSavedCities] = useState([]);
    const [favoriteCities, setFavoriteCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [citiesError, setCitiesError] = useState("");

    const [user, setUser] = useState(null);

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

        setFavoriteCities(updated.filter(c => c.isFavorite));
        setSavedCities(updated.filter(c => !c.isFavorite));
    };

    // Fetch all saved/favorite cities for the user
    // Moved up to avoid ReferenceError
    const fetchSavedCities = async (currentUser) => {
        setLoadingCities(true);
        setCitiesError("");

        const userId = currentUser?._id || currentUser?.id;
        if (!userId) {
            setCitiesError("User not logged in");
            setLoadingCities(false);
            return;
        }

        try {
            const res = await fetch(`/api/favorite-cities/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch cities");
            const data = await res.json();
            const cities = data.cities || [];

            // Ensure boolean isFavorite
            const normalized = cities.map(city => ({
                ...city,
                isFavorite: !!city.isFavorite,
            }));

            await fetchWeatherForCities(normalized);
        } catch (err) {
            console.error(err);
            setCitiesError("Failed to load saved cities");
        } finally {
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        // Initialize time on client
        setCurrentTime(new Date());

        // Moved inside useEffect to be client-side only safe
        const rawStored = localStorage.getItem("loggedUser") || localStorage.getItem("user");
        const parsedUser = rawStored ? JSON.parse(rawStored) : null;
        setUser(parsedUser);

        if (!parsedUser) {
            router.push("/login");
            return; // Stop execution
        }

        setUserName(parsedUser.email || parsedUser.username || "");
        setLastLogin(parsedUser.lastLogin || "");

        // Safe fetch calls initiated here
        const fetchUsersCount = async () => {
            try {
                const res = await fetch("/api/user/count");
                const data = await res.json();
                if (data.success) setTotalUsers(data.count);
            } catch { }
        };

        fetchUsersCount();

        // Call fetch saved cities with the parsed user
        fetchSavedCities(parsedUser);

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);



    const goToDetails = (cityName) => {
        router.push(`/weather/${cityName}`);
    };

    const removeCity = async (cityId, type = "saved") => {
        // Optimistic UI update
        if (type === "favorite") {
            setFavoriteCities(prev => prev.filter(c => c._id !== cityId));
        } else {
            setSavedCities(prev => prev.filter(c => c._id !== cityId));
        }

        try {
            await fetch("/api/favorite-cities/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cityId }),
            });
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const toggleFavorite = async (city) => {
        const userId = user._id || user.id;
        const newStatus = !city.isFavorite;

        try {
            // Optimistic Update
            const updatedCity = { ...city, isFavorite: newStatus };
            if (newStatus) {
                setFavoriteCities(prev => [...prev, updatedCity]);
                setSavedCities(prev => prev.filter(c => c._id !== city._id));
            } else {
                setSavedCities(prev => [...prev, updatedCity]);
                setFavoriteCities(prev => prev.filter(c => c._id !== city._id));
            }

            await fetch("/api/favorite-cities/favorite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, cityId: city._id, isFavorite: newStatus }),
            });
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            // Revert changes on error (simplified for now)
            fetchSavedCities(user);
        }
    };

    const formatTime = (date) =>
        date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

    const formatDate = (date) =>
        date ? date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

    return (
        <main className="main-content">
            <div className="header-section">
                <div>
                    <h1 className="welcome">
                        Welcome back, <span className="user-name">{(userName || "").split("@")[0]}</span> 👋
                    </h1>
                    <p className="subtitle">Your personalized weather dashboard.</p>
                </div>

                <div className="time-widget">
                    <div className="time-display">{currentTime ? formatTime(currentTime) : "--:--:--"}</div>
                    <div className="date-display">{currentTime ? formatDate(currentTime) : "Loading..."}</div>
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

                <div className="card card-searches" onClick={() => router.push("/")}>
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
    );
}
