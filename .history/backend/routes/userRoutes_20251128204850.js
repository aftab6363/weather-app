import express from "express";
import User from "../models/user.js";

const router = express.Router();

// ===============================
// ✅ REGISTER USER (PLAIN PASSWORD)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Store password as plain text
    const newUser = new User({
      name: fullName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ===============================
// ✅ LOGIN USER (PLAIN TEXT CHECK)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Direct string comparison (no hashing)
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    return res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.json({
      success: false,
      message: "Server Error",
    });
  }
});

// ==================================
// ✅ GET TOTAL USERS COUNT
// ==================================
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.json({
      success: false,
      message: "Error getting user count",
    });
  }
});

export default router;
