const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register
router.post("/register", authController.register);

// GET /api/auth/register?token=...
router.get("/register", authController.validateToken);

module.exports = router;
