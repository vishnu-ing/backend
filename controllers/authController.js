const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user - NOTE: database field is "userName" but we accept "username" from frontend
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "24h" }
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        onboardingStatus: user.onboardingStatus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
};
