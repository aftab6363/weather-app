// components/SaveCityButton.jsx
import React from "react";
import  "../styles/home.css";

export default function SaveCityButton({ cityName }) {
  const handleSaveCity = async () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) return alert("Please login first");

    try {
      const response = await fetch("http://localhost:5000/api/favorite-cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedUser._id,
          cityName,
          customName: cityName,
        }),
      });

      const data = await response.json();
      if (data.message) alert(data.message);
    } catch (err) {
      console.error("Error saving city:", err);
      alert("Failed to save city");
    }
  };

  if (!cityName) return null;

  return (
    <div className="save-city-container">
      <button className="save-city-btn" onClick={handleSaveCity}>
        ⭐ Save to Favorites
      </button>
    </div>
  );
}
