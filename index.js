const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection - with better error handling
const connectDB = async () => {
  try {
    if (
      !process.env.MONGODB_URI ||
      process.env.MONGODB_URI.includes("localhost")
    ) {
      console.log(
        "⚠️  Using default/local MongoDB URI - make sure MongoDB is running"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/employee-portal"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server starting without database connection");
  }
};

// Connect to database
connectDB();

// Basic health check route
app.get("/", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    status: "running",
    message: "Employee Onboarding Backend API",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: ["/api/health"],
  });
});

// API health check
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "healthy",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📦 Dependencies: Express, Mongoose, CORS, JWT, bcrypt, AWS SDK installed`
  );
});
