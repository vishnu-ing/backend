// Update only the status of a facility report
exports.updateFacilityReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const report = await FacilityReport.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update a comment in a facility report (HR only)
exports.updateComment = async (req, res) => {
  try {
    const { reportId, commentId } = req.params;
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    const report = await FacilityReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Facility report not found' });
    }
    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    comment.description = description;
    comment.timestamp = new Date();
    await report.save();
    // Map timestamp to createdAt for frontend compatibility
    const commentWithCreatedAt = {
      ...comment.toObject(),
      createdAt: comment.timestamp,
    };
    res.json(commentWithCreatedAt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add a comment to a facility report
exports.addCommentToFacilityReport = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res
        .status(400)
        .json({ message: 'Comment description is required' });
    }
    const report = await FacilityReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Facility report not found' });
    }
    const comment = {
      description,
      createdBy: req.user.id,
      timestamp: new Date(),
    };
    report.comments.push(comment);
    await report.save();
    // Re-fetch the report and populate the last comment's createdBy
    const populatedReport = await FacilityReport.findById(
      req.params.id
    ).populate({
      path: 'comments.createdBy',
      select: 'userName firstName lastName role',
    });
    const lastComment =
      populatedReport.comments[populatedReport.comments.length - 1];
    // Map timestamp to createdAt for frontend compatibility
    const commentWithCreatedAt = {
      ...lastComment.toObject(),
      createdAt: lastComment.timestamp,
    };
    res.status(201).json(commentWithCreatedAt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// facility report controller
const FacilityReport = require('../models/FacilityReport');

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

const mongoose = require('mongoose');
// Get users facility reports, optionally filter by houseId
exports.getUsersFacilityReports = async (req, res) => {
  try {
    const query = {};
    if (req.query.houseId) {
      console.log('Received houseId:', req.query.houseId);
      try {
        query.houseId = new mongoose.Types.ObjectId(req.query.houseId);
      } catch (err) {
        return res.status(400).json({
          message: 'Invalid houseId format',
          houseId: req.query.houseId,
        });
      }
    }
    const reports = await FacilityReport.find(query)
      .populate({
        path: 'reportedBy',
        select: 'userName firstName lastName',
      })
      .populate({
        path: 'comments.createdBy',
        select: 'userName firstName lastName role',
      });
    // Explicitly map updatedAt to guarantee it is present
    const mappedReports = reports.map((r) => ({
      ...r.toObject(),
      updatedAt: r.updatedAt,
    }));
    res.json(mappedReports);
  } catch (error) {
    console.error('Error fetching facility reports:', error);
    res.status(500).json({ message: error.message });
  }
};

// get report by id
exports.getFacilityReportById = async (req, res) => {
  try {
    const report = await FacilityReport.findOne({
      _id: req.params.id,
      reportedBy: req.user.id,
    })
      .populate({
        path: 'reportedBy',
        select: 'userName firstName lastName',
      })
      .populate({
        path: 'comments.createdBy',
        select: 'userName firstName lastName role',
      });
    if (!report) return res.status(404).json({ message: 'Report not found' });
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
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
