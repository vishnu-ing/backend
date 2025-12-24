// comments controller
const FacilityReport = require("../models/FacilityReport");

// Add a comment to a facility report
exports.addCommentToReport = async (req, res) => {
  try {
    const report = await FacilityReport.findOne({
      _id: req.params.id,
      reportedBy: req.user.id,
    });
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.comments.push({
      description: req.body.description,
      createdBy: req.user.id,
    });

    await report.save();
    res.status(201).json(report.comments[report.comments.length - 1]); // retrieves the newly added comment
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a facility report
exports.listCommentsForReport = async (req, res) => {
  try {
    const report = await FacilityReport.findOne({
      _id: req.params.id,
      reportedBy: req.user.id,
    }).populate("comments.createdBy", "name phone email");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(
      report.comments.map((c) => ({
        id: c._id,
        description: c.description,
        createdBy: c.createdBy,
        timestamp: c.timestamp,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
