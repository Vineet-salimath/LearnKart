import express from 'express';
import {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
  unenrollStudent
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('STUDENT', 'INSTRUCTOR', 'ADMIN'), enrollCourse);
router.get('/my', authenticate, authorize('STUDENT'), getMyEnrollments);
router.get('/check/:courseId', authenticate, checkEnrollment);
router.delete('/:courseId', authenticate, authorize('ADMIN'), unenrollStudent);

export default router;
