const jwt = require('jsonwebtoken');
const { users } = require('../models');

// Set JWT secret from environment variable or use a default for development (same as in userService)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Middleware to authenticate user based on JWT
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token using the same JWT_SECRET as userService
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user
    const user = await users.findOne({ where: { id: decoded.id } });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach the user to the request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

/**
 * Middleware to check if the user is an admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin
}; 