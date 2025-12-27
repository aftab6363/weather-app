import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
import userRoutes from "./routes/userRoutes.js";

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

// mount routes
app.use("/api/user", userRoutes);

// basic health check
app.get("/", (req, res) => res.send({ success: true, message: "Server is running" }));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
