import { Roles } from '../utils/enums.js';

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (!userRole) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }
    next();
  };
};

export const isAdmin = authorizeRoles(Roles.admin);
export const isStudentOrAdmin = authorizeRoles(Roles.student, Roles.admin);

