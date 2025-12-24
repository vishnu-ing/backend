const mongoose = require("mongoose");
const User = require("./models/User");
const House = require("./models/House");
const FacilityReport = require("./models/FacilityReport");
const dotenv = require("dotenv");

dotenv.config();

const seedFacilityReport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find citizen1 and their house
    const citizen1 = await User.findOne({ userName: "citizen1" });
    if (!citizen1) throw new Error("citizen1 not found");
    const house = await House.findOne({ residents: citizen1._id });
    if (!house) throw new Error("House for citizen1 not found");

    // Create a facility report for citizen1
    const report = await FacilityReport.create({
      houseId: house._id,
      reportedBy: citizen1._id,
      title: "Test Facility Report",
      description: "This is a test facility report for citizen1.",
      status: "Open",
    });
    console.log("Facility report created for citizen1:", report);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding facility report:", error);
    process.exit(1);
  }
};

seedFacilityReport();
