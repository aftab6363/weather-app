import dotenv from ".env";
env.config();

import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/WeatherRoutes.js";

// create express app FIRST
const app = express();
const port = 5000;

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

// basic health check
app.get("/", (req, res) =>
  res.send({ success: true, message: "Server is running" })
);

// start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
