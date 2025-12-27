import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

import "./style.css";

function AppContent() {

  // ✅ Instead of checking localStorage directly, store it in state
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const savedStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(savedStatus);
  }, []);

  // ✅ Avoid rendering routes until login state is known → Removes blinking
  if (isLoggedIn === null) {
    return null; // you can replace with a loader later
  }

  return (
    <div className="app">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registration" element={<Registration />} />

        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <Footer />
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
