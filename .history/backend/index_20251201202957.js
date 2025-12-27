// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";          
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/WeatherRoutes.js";
import favoriteCityRoutes from "./routes/favoriteCityRoutes.js"; // ✅ favorite city routes

// Load environment variables first
dotenv.config();

// Create express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// Connect to MongoDB
connectToMongo();

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api", favoriteCityRoutes); // ✅ favorite city routes

// Health check endpoint
app.get("/", (req, res) => 
  res.send({ success: true, message: "Server is running" })
);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(
    `🔑 OpenWeather API Key: ${
      process.env.OPENWEATHER_API_KEY ? "Loaded ✅" : "Missing ❌"
    }`
  );
});
