// facility report controller
const FacilityReport = require("../models/FacilityReport");

// Create a new facility report
exports.createFacilityReport = async (req, res) => {
  try {
    const report = await FacilityReport.create({
      houseId: req.body.houseId,
      reportedBy: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get users facility reports
exports.getUsersFacilityReports = async (req, res) => {
  try {
    const reports = await FacilityReport.find({});
    res.json(reports);
  } catch (error) {
    console.error("Error fetching facility reports:", error);
    res.status(500).json({ message: error.message });
  }
};

// get report by id
exports.getFacilityReportById = async (req, res) => {
  try {
    const report = await FacilityReport.findOne({
      _id: req.params.id,
      reportedBy: req.user.id,
    });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update facility report
exports.updateFacilityReport = async (req, res) => {
  try {
    const report = await FacilityReport.findOneAndUpdate(
      { _id: req.params.id, reportedBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
