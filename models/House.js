const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    landlord: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    facilityInfo: {
      beds: { type: Number, default: 0 },
      mattresses: { type: Number, default: 0 },
      tables: { type: Number, default: 0 },
      chairs: { type: Number, default: 0 },
    },
    //link to user object
    residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true } //added timestamps for createdAt and updatedAt
);

module.exports = mongoose.model("House", HouseSchema);
