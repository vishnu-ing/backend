const express = require('express')
const router = express.Router();

const {
  getPersonalInfo,
  updatePersonalInfo,
} = require("../controllers/userController");

router.get("/:userId", getPersonalInfo);
router.put("/:userId", updatePersonalInfo);

module.exports = router