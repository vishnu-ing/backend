const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth');
const { getEmployeesWithApprovedVisas, getInProgressF1Visas,updateVisaStatus,notifyEmployee } = require('../controllers/hrVisaController')

// const cors = require("cors");
// const corsOptions = {
//  origin: ['http://localhost:4200','http://localhost:5173'],
//  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//  allowedHeaders: ['Content-Type', 'Authorization'],
// };
// router.use(cors(corsOptions));
// router.options("*", cors(corsOptions));



// GET api/hr/employees/approved
// for Show All Component
router.get('/approved', auth, getEmployeesWithApprovedVisas)


// api/hr/employees
// For In Progress Component
router.get("/in-progress", auth, getInProgressF1Visas);
router.patch("/:visaId/status", auth, updateVisaStatus);
router.post("/:visaId/notify", auth,  notifyEmployee);


module.exports=router