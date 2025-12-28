const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const personalInfoRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection - with better error handling
//Mongo DB is not setup yet, waiting for meeting to discuss best way to implement, this is just initial setup
const connectDB = async () => {
  try {
    if (
      !process.env.MONGODB_URI ||
      process.env.MONGODB_URI.includes("localhost")
    ) {
      console.log(
        "Using default/local MongoDB URI - make sure MongoDB is running"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/employee-portal"
    );
    console.log("MongoDB connected successfully");
    console.log("🟢 Connected DB:", mongoose.connection.name);
    console.log("Currently running on Port:", PORT);
    // console.log("process.env.mongodburi:", process.env.MONGODB_URI)
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("Server starting without database connection");
  }
};

// Connect to database
connectDB();

// Import routes
const authRoutes = require("./routes/authRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const hrhiringRoutes = require("./routes/HRhiringRoutes");
const facilityReportRoutes = require("./routes/facilityReportRoutes");
const commentRoutes = require("./routes/commentRoutes");
const housingRoutes = require("./routes/housingRoutes");
const  hrAuthRoutes  = require("./routes/hrAuthRoutes");
const visaRoutes = require("./routes/visaRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
//temp for file uploads will replace with s3 server
app.use("/uploads", express.static("uploads"));

app.use("/api/personal-info", personalInfoRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hiring", hrhiringRoutes);
app.use("/api/facility-reports", facilityReportRoutes);
app.use("/api/facility-reports", commentRoutes);
app.use("/api/housing", housingRoutes);
app.use("/api/visa", visaRoutes);

// HR Login
app.use("/api/hr/auth", hrAuthRoutes)


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

// Shut down connection and free up port
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Dependencies: Express, Mongoose, CORS, JWT, bcrypt, AWS SDK installed`
  );
});

const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    console.log("🟢 HTTP server closed");

    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log("🟢 MongoDB connection closed");
      }
    } catch (err) {
      console.error("🔴 Error closing MongoDB connection:", err);
    } finally {
      process.exit(0);
    }
  });

  // Safety net
  setTimeout(() => {
    console.error("🔴 Force shutdown (connections did not close in time)");
    process.exit(1);
  }, 10000);
};
process.on("SIGINT", shutdown); // Ctrl + C (terminal)
process.on("SIGTERM", shutdown); // kill PID / Docker / PM2
