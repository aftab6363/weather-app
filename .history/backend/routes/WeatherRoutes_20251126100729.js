import express from "express";
import { getWeather } from "../controllers/weatherController.js";

const router = express.Router();

// /api/weather?city=Lahore
router.get("/", getWeather);

export default router;
