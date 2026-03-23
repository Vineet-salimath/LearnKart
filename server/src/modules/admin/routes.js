import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getCourses,
  getOrders,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);

// Courses
router.get('/courses', getCourses);

// Orders
router.get('/orders', getOrders);

// Coupons
router.post('/coupons', createCoupon);
router.get('/coupons', getCoupons);
router.patch('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
