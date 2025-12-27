const express = require("express");
const router = express.Router();
const hiringcontroller = require("../controllers/HRhiringcontroller");

router.get('/applications', hiringcontroller.getallemployee);

router.post('/decision', hiringcontroller.updateApplicationStatus);
router.get('/tokens', hiringcontroller.getAllRegistrationTokens);
router.post('/token', hiringcontroller.generateRegistrationToken);

module.exports = router;