const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const createTestUser = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee-portal"
    );
    console.log("Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ userName: "testuser" });
    if (existingUser) {
      console.log("Test user already exists");
      console.log("Username: testuser");
      console.log("Password: password123");
      process.exit(0);
    }

    // Create test user - password will be auto-hashed by User model
    const testUser = new User({
      userName: "testuser",
      email: "test@example.com",
      password: "password123", // Will be hashed automatically
      role: "Employee",
      onboardingStatus: "Not Started",
      firstName: "Test",
      lastName: "User",
      ssn: "123-45-6789",
      DOB: "1990-01-01",
      cellPhone: "555-0000",
      address: {
        street: "123 Test St",
        city: "Test City",
        state: "NJ",
        zip: "12345",
      },
    });

    await testUser.save();
    console.log(" Test user created successfully!");
    console.log("Username: testuser");
    console.log("Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
};

createTestUser();
