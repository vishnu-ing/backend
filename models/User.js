const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    //authenticating and role
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: employee, enum:['HR','Employee']},

    onboardingStatus: { 
        type: String, 
        enum: ['Not Started', 'Pending', 'Approved', 'Rejected'], 
        default: 'Not Started' 
    },
    
    //personal info
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    middleName: { type: String, default: "" },
    profilePicture:{type: String, default: ""},
    preferredName: {type: String},
    profilePicture: { type: String, default: "default_avatar.png" }, //default is placeholder till we find an icon
    ssn: {type: String, required: true, unique: true},
    DOB: {type: String, required: true},
    gender: {type: String, default: "I do not wish to answer"},

    //contact info
    cellPhone: {type: String, required: true},
    workPhone: {type: String, default: ""},
    address: {
        buildingApt:{type: String},
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
    },

    
    VisaDocument: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaDocument'
    }],

    driverlicense: {
        hasLicense: {type: String, enum:['Yes','No'], default: 'No'},
        expirationDate: {type: Date},
        number: {type: String},
        photo: {type: String}
    },

    //referral and Emergency contact
    reference:{
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        phone: {type: String, required: true},
        email: {type: String, required: true},
        relationship: {type: String, required: true},
        middlename: {type: String, default:""}
    },
    emergencyContacts: [{
        firstName: {type: String},
        lastName: {type: String},
        middleName: {type: String},
        phone: {type: String},
        email: {type: String},
        relationship: {type: String}
    }],
});

module.exports = mongoose.model('User', UserSchema);