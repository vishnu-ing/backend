const User = require("../models/User");
const jwt = require("jsonwebtoken");
const RegistrationToken = require("../models/RegistrationToken");
const House = require("../models/House");
const https = require("https");

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
      { expiresIn: "10m" }
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

exports.register = async (req, res) => {
  try {
    const { username, email, password, token } = req.body;

    if (!username || !email || !password || !token) {
      return res
        .status(400)
        .json({ message: "username, email, password, and token are required" });
    }

    const regToken = await RegistrationToken.findOne({ token });
    if (!regToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired registration token" });
    }
    if (regToken.status !== "Pending") {
      return res
        .status(401)
        .json({ message: "Registration token already used" });
    }

    // REMOVED EMAIL VALIDATION - user can use any email

    const existingUserByName = await User.findOne({ userName: username });
    if (existingUserByName) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const nameParts = String(regToken.name || "").split(" ");
    const firstName = nameParts[0] || "First";
    const lastName = nameParts.slice(1).join(" ") || "Last";

    const newUser = new User({
      userName: username,
      email,
      password,
      role: "Employee",
      onboardingStatus: "Not Started",
      firstName,
      lastName,
      ssn: `TBD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      DOB: "1970-01-01",
      cellPhone: "000-000-0000",
      address: {
        street: "TBD",
        city: "TBD",
        state: "TBD",
        zip: "00000",
      },
    });

    await newUser.save();

    const smallestHouseAgg = await House.aggregate([
      { $project: { residentsCount: { $size: "$residents" } } },
      { $sort: { residentsCount: 1 } },
      { $limit: 1 },
    ]);

    if (smallestHouseAgg && smallestHouseAgg.length > 0) {
      await House.findByIdAndUpdate(smallestHouseAgg[0]._id, {
        $push: { residents: newUser._id },
      });
    }

    regToken.status = "Used";
    await regToken.save();

    const jwtToken = jwt.sign(
      {
        userId: newUser._id,
        userName: newUser.userName,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "24h" }
    );

    try {
      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const payload = JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            to_name: `${firstName} ${lastName}`,
            message: "Welcome to the Employee Portal!",
          },
        });

        const reqOptions = {
          method: "POST",
          hostname: "api.emailjs.com",
          path: "/api/v1.0/email/send",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        };

        await new Promise((resolve, reject) => {
          const request = https.request(reqOptions, (resp) => {
            resp.on("data", () => {});
            resp.on("end", resolve);
          });
          request.on("error", reject);
          request.write(payload);
          request.end();
        });
      }
    } catch (e) {
      console.warn("EmailJS send failed:", e.message);
    }

    res.status(201).json({
      message: "Registration successful",
      token: jwtToken,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        onboardingStatus: newUser.onboardingStatus,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.query.token || req.body?.token;
    if (!token) {
      return res.status(401).json({ message: "Missing registration token" });
    }

    const regToken = await RegistrationToken.findOne({ token });
    if (!regToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired registration token" });
    }
    if (regToken.status !== "Pending") {
      return res
        .status(401)
        .json({ message: "Registration token already used" });
    }

    return res.json({
      valid: true,
      email: regToken.email,
      name: regToken.name,
    });
  } catch (error) {
    console.error("Validate token error:", error);
    res.status(500).json({ message: "Server error validating token" });
  }
};
