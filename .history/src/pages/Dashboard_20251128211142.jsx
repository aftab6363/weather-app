import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastLogin, setLastLogin] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

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

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
          <li className="menu-item">
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
              Welcome back, <span className="user-name">{userName.split('@')[0]}</span> 👋
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
              <p className="card-value">
                <span className="counter" data-target={totalUsers}>{totalUsers}</span>
              </p>
              <div className="card-trend">
                <span className="trend-up">↗ 12% this month</span>
              </div>
            </div>
            <div className="card-glow card-glow-blue"></div>
          </div>

          <div className="card card-login">
            <div className="card-icon-wrapper">
              <div className="card-icon">🕐</div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Last Login</h3>
              <p className="card-value last-login-value">
                {lastLogin || "Not Recorded"}
              </p>
              <div className="card-trend">
                <span className="trend-neutral">● Active now</span>
              </div>
            </div>
            <div className="card-glow card-glow-purple"></div>
          </div>

          <div className="card card-searches" onClick={() => navigate("/")}>
              <div className="card-icon-wrapper">
                <div className="card-icon">🔍</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Search Weather</h3>
                <p className="card-value">
                  <span className="coming-soon">Click to search cities</span>
                </p>
                <div className="card-trend">
                  <span className="trend-neutral">● Real-time Weather</span>
                </div>
              </div>
              <div className="card-glow card-glow-orange"></div>
            </div>

        </div>

      

        

      </main>

    </div>
  );
}
