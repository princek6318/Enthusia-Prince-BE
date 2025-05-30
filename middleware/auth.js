const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the admin ID to the request object
    req.adminId = decoded.adminId;
    
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ 
      status: 'error',
      message: 'Invalid or expired token.' 
    });
  }
};