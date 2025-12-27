import express from "express";
import { getWeather, get7DayForecast } from "../controllers/weatherController.js";

const router = express.Router();

// CURRENT WEATHER
// /api/weather?city=Lahore
router.get("/", getWeather);

// 7-DAY FORECAST
// /api/weather/7days/:city
router.get("/7days/:city", get7DayForecast);

export default router;
