// Middleware to check if user has HR role
module.exports = function (req, res, next) {
  if (req.user && req.user.role === 'HR') {
    return next();
  }
  return res.status(403).json({ message: 'HR role required' });
};
