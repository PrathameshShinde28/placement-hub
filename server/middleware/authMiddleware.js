import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ Verify JWT token and set userId & userRole
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Get user to set role
    const user = await User.findById(req.userId);
    req.userRole = user?.role || 'student';
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// ✅ Role-based authorization - checks if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  };
};

// ✅ Admin-only middleware - shorthand for authorize('admin')
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. This action requires admin privileges.' 
    });
  }
  next();
};
