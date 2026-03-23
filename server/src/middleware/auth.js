import jwt from 'jsonwebtoken';
import { sendError } from '../utils/helpers.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    sendError(res, 'Invalid token', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
