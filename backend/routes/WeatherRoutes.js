import express from "express";
import { getWeather, get7DayForecast } from "../controllers/weatherController.js";

const router = express.Router();

// CURRENT WEATHER
// /api/weather?city=CityName
router.get("/", getWeather);

// 5-DAY FORECAST
// /api/weather/5days/:city
router.get("/5days/:city", get7DayForecast);

export default router;
