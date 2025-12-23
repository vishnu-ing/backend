// housing routes
const express = require("express");
const router = express.Router();
const { getMyHousing } = require("../controllers/housingController");
const auth = require("../middlewares/auth");

// route to get housing info (protected)
router.get("/me", auth, getMyHousing);

module.exports = router;
