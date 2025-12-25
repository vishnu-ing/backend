const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    
    const token = req.headers.authorization?.split(" ")[1]; //get "Bearer <token>"
    
    if (!token)
      return res.status(403).json({ message: "Authentication required" });
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    
    // Attach user info with id property for downstream use
    req.user = {
      id: decoded.userId || decoded.id, // support both userId and id
      userName: decoded.userName,
      role: decoded.role,
    };
    
    console.log("req.user: ", req.user)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = auth;
