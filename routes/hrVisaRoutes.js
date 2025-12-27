const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth');
const { getEmployeesWithApprovedVisas } = require('../controllers/hrVisacontroller');

// GET api/hr/employees/approved
router.get('/approved', auth, getEmployeesWithApprovedVisas)

module.exports=router