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

    // Update Last Login
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin.toLocaleString(),
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

// ==================================
// ✅ CHANGE PASSWORD
// ==================================
router.put("/change-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Direct string comparison (as per login)
    if (user.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ==================================
// ✅ DELETE ACCOUNT
// ==================================
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
