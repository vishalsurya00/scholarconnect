/**
 * Admin authorization middleware
 * Checks if req.user exists and has role === 'admin'
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Admin privileges required.',
    });
  }
};

module.exports = { admin };
