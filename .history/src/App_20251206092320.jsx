import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WeatherDetails from "./pages/WeatherDetails";   // ✅ NEW

import "./style.css";

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const hideLayout = location.pathname === "/dashboard";

  return (
    <div className="app">
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* NEW WEATHER PAGE */}
        <Route path="/weather/:city" element={<WeatherDetails />} />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <WeatherDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
