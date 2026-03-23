import { sendError } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma validation errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return sendError(res, `${field} already exists`, 400);
  }

  // Prisma not found errors
  if (err.code === 'P2025') {
    return sendError(res, 'Resource not found', 404);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Custom error with statusCode
  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode);
  }

  // Default server error
  sendError(res, 'Internal server error', 500);
};
