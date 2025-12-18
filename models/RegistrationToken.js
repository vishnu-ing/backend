const mongoose = require('mongoose');

const RegistrationTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Used'], 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 10800 //3 hrs
    }
});

module.exports = mongoose.model('RegistrationToken', RegistrationTokenSchema);