// middleware/auth.js
// Dummy authentication middleware for testing
// Later replace this with your actual login/auth logic

export default function authMiddleware(req, res, next) {
    // For now, assume a fixed user ID (replace with real user from login later)
    req.user = { id: "650000000000000000000001" }; 
    next();
  }
  