// routes/favoriteCityRoutes.js
import express from "express";
import {
  saveCity,
  getCities,
  updateCity,
  deleteCity,
  toggleFavorite,  // 🔥 new controller
} from "../controllers/favoriteCityController.js";

const router = express.Router();

// Save a new city
router.post("/favorite-cities", saveCity);

// Get all cities for a user
router.get("/favorite-cities/:userId", getCities);

// Update a city
router.put("/favorite-cities/update", updateCity);

// Delete a city
router.delete("/favorite-cities/delete", deleteCity);

// Toggle favorite
router.patch("/favorite-cities/favorite", toggleFavorite); // 🔥
// routes/favoriteCityRoutes.js
router.patch("/favorite-cities/favorite", toggleFavoriteStatus);


export default router;
