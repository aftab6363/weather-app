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

import "./style.css";

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const hideLayout = location.pathname === "/dashboard"; // ✅ Proper check

  return (
    <div className="app">
      {/* ✅ Hide Navbar on Dashboard */}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Website Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* ✅ Default redirect if route doesn't exist */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>

      {/* ✅ Hide Footer on Dashboard */}
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
