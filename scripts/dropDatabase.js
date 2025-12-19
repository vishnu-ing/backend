const mongoose = require("mongoose");
require("dotenv").config();

const dropDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee-portal"
    );
    console.log("Connected to MongoDB");

    await mongoose.connection.dropDatabase();
    console.log(" Database dropped successfully!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

dropDatabase();
