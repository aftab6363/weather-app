// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/WeatherRoutes.js";
import favoriteCityRoutes from "./routes/favoriteCityRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// 🚀 FIX: prevent Express from blocking Vite's frontend asset files
app.use((req, res, next) => {
  if (req.url.startsWith("/assets/")) {
    return res.status(404).end();
  }
  next();
});

connectToMongo();

app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api", favoriteCityRoutes);

app.get("/", (req, res) =>
  res.send({ success: true, message: "Server is running" })
);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(
    `🔑 OpenWeather API Key: ${
      process.env.OPENWEATHER_API_KEY ? "Loaded ✅" : "Missing ❌"
    }`
  );
});
