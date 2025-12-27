// routes/favoriteCityRoutes.js
import express from "express";
import { saveCity } from "../controllers/favoriteCityController.js";

const router = express.Router();

// ⭐ NO AUTH — we pass userId from frontend manually
router.post("/favorite-cities", saveCity);

export default router;
