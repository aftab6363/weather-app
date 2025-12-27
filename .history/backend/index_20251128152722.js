import express from "express";
import cors from "cors";
import dotenv from "dotenv";          // ✅ import dotenv
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/WeatherRoutes.js";
import favoriteCityRoutes from "./routes/favoriteCityRoutes.js"; // ✅ import favorite city routes

// Load environment variables as early as possible
dotenv.config(); // ✅ must be **before** using process.env

// create express app FIRST
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// connect to mongo
connectToMongo();

// mount routes (AFTER app is created)
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api", favoriteCityRoutes); // ✅ mount favorite city routes

// basic health check
app.get("/", (req, res) => 
  res.send({ success: true, message: "Server is running" })
);

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`🔑 OpenWeather API Key: ${process.env.OPENWEATHER_API_KEY ? "Loaded ✅" : "Missing ❌"}`);
});
