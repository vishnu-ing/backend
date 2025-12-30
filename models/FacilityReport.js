const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const FacilityReportSchema = new mongoose.Schema(
  {
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    }, //link the house
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, //link the user that made report
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FacilityReport', FacilityReportSchema);
