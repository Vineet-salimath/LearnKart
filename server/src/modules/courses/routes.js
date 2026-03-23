import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  togglePublish,
  getMyCourses,
  getCourseStats
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/slug/:slug', getCourseBySlug);

// Protected routes
router.post('/', authenticate, authorize('INSTRUCTOR', 'ADMIN'), createCourse);
router.put('/:id', authenticate, authorize('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCourse);
router.patch('/:id/publish', authenticate, authorize('INSTRUCTOR', 'ADMIN'), togglePublish);
router.get('/instructor/my-courses', authenticate, authorize('INSTRUCTOR'), getMyCourses);
router.get('/:id/stats', authenticate, authorize('INSTRUCTOR'), getCourseStats);

export default router;
