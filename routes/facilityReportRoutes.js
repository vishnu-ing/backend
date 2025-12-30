// facility report routes
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const {
  createFacilityReport,
  getUsersFacilityReports,
  getFacilityReportById,
  updateFacilityReport,
  addCommentToFacilityReport,
  updateComment,
  updateFacilityReportStatus,
} = require('../controllers/facilityReportController');

// PUT /api/facility-reports/:id/status - update only the status of a facility report (protected)
router.put('/:id/status', auth, updateFacilityReportStatus);

// PUT /api/facility-reports/:reportId/comments/:commentId - update a comment (HR only)
router.put('/:reportId/comments/:commentId', auth, roleCheck, updateComment);

// POST /api/facility-reports - create a new facility report (protected)
router.post('/', auth, createFacilityReport);

// GET /api/facility-reports - get user's facility reports (protected)
router.get('/', auth, getUsersFacilityReports);

// GET /api/facility-reports/:id - get a specific facility report by id (protected)
router.get('/:id', auth, getFacilityReportById);

// PUT /api/facility-reports/:id - update a specific facility report by id (protected)
router.put('/:id', auth, updateFacilityReport);

// POST /api/facility-reports/:id/comments - add a comment to a facility report (protected)
router.post('/:id/comments', auth, addCommentToFacilityReport);

module.exports = router;
