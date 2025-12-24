// facility report routes
const express = require("express");
const router = express.Router();
const {
  createFacilityReport,
  getUsersFacilityReports,
  getFacilityReportById,
  updateFacilityReport,
  addCommentToFacilityReport,
} = require("../controllers/facilityReportController");
const auth = require("../middlewares/auth");

// POST /api/facility-reports - create a new facility report (protected)
router.post("/", auth, createFacilityReport);

// GET /api/facility-reports - get user's facility reports (protected)
router.get("/", auth, getUsersFacilityReports);

// GET /api/facility-reports/:id - get a specific facility report by id (protected)
router.get("/:id", auth, getFacilityReportById);

// PUT /api/facility-reports/:id - update a specific facility report by id (protected)
router.put("/:id", auth, updateFacilityReport);

// POST /api/facility-reports/:id/comments - add a comment to a facility report (protected)
router.post("/:id/comments", auth, addCommentToFacilityReport);

module.exports = router;
