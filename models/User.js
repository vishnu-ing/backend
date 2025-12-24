const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("./VisaDocument"); 

const UserSchema = new mongoose.Schema({
  //authenticating and role
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Employee", enum: ["HR", "Employee"] },
  onboardingStatus: {
    type: String,
    enum: ["Not Started", "Pending", "Approved", "Rejected"],
    default: "Not Started",
  },
  isCitizen: {type: String, default:"No"},
  greencard: {type: String, default:"No"},
  //personal info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, default: "" },
  preferredName: { type: String },
  profilePicture: { type: String, default: "default_avatar.png" },
  ssn: { type: String, required: true, unique: true },
  DOB: { type: String, required: true },
  gender: { type: String, default: "I do not wish to answer" },
  //contact info
  cellPhone: { type: String, required: true },
  workPhone: { type: String, default: "" },
  address: {
    buildingApt: { type: String},
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  VisaDocument: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaDocument",
    },
  ],
  driverlicense: {
    hasLicense: { type: String, enum: ["Yes", "No"], default: "No" },
    expirationDate: { type: Date },
    number: { type: String },
    fileUrl: { type: String },
  },
  //referral and Emergency contact
  reference: {
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String },
    middlename: { type: String, default: "" },
  },
  emergencyContacts: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String , required: true},
      middleName: { type: String },
      phone: { type: String , required: true},
      email: { type: String , required: true},
      relationship: { type: String, required: true },
    },
  ],
  feedback:{type: String, default:''},
  car:{
      make:{type: String},
      model:{type: String},
      color:{type: String}
  }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

