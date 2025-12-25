const express = require("express");
const router = express.Router();
const hrAuthController = require('../controllers/hrAuthController')

// POST api/hr/auth/login
router.post("/login", hrAuthController.login)

module.exports = router