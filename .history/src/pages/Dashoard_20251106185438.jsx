import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    setUserName(loggedUser.email);
    setLastLogin(loggedUser.lastLogin);

    const fetchUsersCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/count");
        const data = await response.json();
        if (data.success) setTotalUsers(data.count);
      } catch (err) {
        console.log("Error fetching users count", err);
      }
    };

    fetchUsersCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      
      <aside className="sidebar">
        <h2 className="sidebar-title">Weather Panel</h2>
        <ul className="menu-list">
          <li className="active">🏠 Dashboard</li>
          <li>👤 Profile</li>
          <li>⚙️ Settings</li>
          <li>🌤️ Weather Search</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <h1 className="welcome">Welcome, {userName} 👋</h1>
        <p className="subtitle">Your personalized weather dashboard.</p>

        <div className="cards-row">
          <div className="card">
            <h3>Total Registered Users</h3>
            <p className="card-value">{totalUsers}</p>
          </div>

          <div className="card">
            <h3>Last Login</h3>
            <p className="card-value">{lastLogin || "Not Recorded"}</p>
          </div>

          <div className="card">
            <h3>Weather Searches</h3>
            <p className="card-value">Coming Soon...</p>
          </div>
        </div>
      </main>

    </div>
  );
}
