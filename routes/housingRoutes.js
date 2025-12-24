// housing routes
const express = require("express");
const router = express.Router();
const { getMyHousing } = require("../controllers/housingController");
const auth = require("../middlewares/auth");

// route to get housing info for logged-in user (protected)
router.get("/me", auth, getMyHousing);

// route to get housing info by house ID (protected)
const { getHousingById } = require("../controllers/housingController");
router.get("/:id", auth, getHousingById);

module.exports = router;
