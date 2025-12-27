// routes/favoriteCityRoutes.js
import express from "express";
import {
  saveCity,
  getCities,
  updateCity,
  deleteCity,
} from "../controllers/favoriteCityController.js";

const router = express.Router();

// ⭐ NO AUTH — userId is sent from frontend manually

// Save a new favorite city
router.post("/favorite-cities", saveCity);

// Get all favorite cities for a user (✅ now GET with route param)
router.get("/favorite-cities/:userId", getCities);

// Update a favorite city
router.put("/favorite-cities/update", updateCity);

// Delete a favorite city
router.delete("/favorite-cities/delete", deleteCity);

export default router;
