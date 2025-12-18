const mongoose = require("mongoose");

const VisaDocumentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['OPT Receipt', 'EAD Card', 'I-20', 'I-94', 'I-983', 'Other']
    },
    fileUrl: {
        type: String, 
        required: true 
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected']
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    feedback: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("VisaDocument", VisaDocumentSchema);