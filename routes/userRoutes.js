const express = require('express')
const router = express.Router();
const {
  getPersonalInfo,
  updatePersonalInfo,
} = require("../controllers/userController");
const auth = require('../middlewares/auth');

router.get("/user", auth, getPersonalInfo);
router.put("/user", auth, updatePersonalInfo);

module.exports = router