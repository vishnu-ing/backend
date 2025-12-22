const mongoose = require("mongoose");

const VisaDocumentSchema = new mongoose.Schema({
    owner: {
        //discussion on whether to store _id or username
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String, 
        required: true,
        default: ""
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected']
    },
    startDate: { 
        type: String, 
        required: true 
    },
    endDate: { 
        type: String, 
        required: true 
    },
    feedback: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("VisaDocument", VisaDocumentSchema);