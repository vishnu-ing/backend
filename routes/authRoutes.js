const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const auth = require("../middlewares/auth");

// POST /api/auth/register - Register a new user
router.post("/register", register);

// GET /api/auth/profile - Get current user profile (protected route)
router.get("/profile", auth, getProfile);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
