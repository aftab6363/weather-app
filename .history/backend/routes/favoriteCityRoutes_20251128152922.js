// routes/favoriteCityRoutes.js
import express from "express";
import { saveCity } from "../controllers/favoriteCityController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// POST API to save a city
router.post("/favorite-cities", authMiddleware, saveCity);

export default router; // ✅ ES module export
