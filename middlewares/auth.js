const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Will implement JWT verification later
  console.log("Auth middleware - to be implemented");
  next();
};

module.exports = auth;
