// comment routes
const express = require("express");
const router = express.Router();
const {
  addCommentToReport,
  listCommentsForReport,
} = require("../controllers/commentController");
const auth = require("../middlewares/auth");

// POST /api/comments/:id/comments - add a comment to a specific report (protected)
router.post("/:id/comments", auth, addCommentToReport);

// GET /api/comments/:id/comments - list comments for a specific report (protected)
router.get("/:id/comments", auth, listCommentsForReport);

module.exports = router;
