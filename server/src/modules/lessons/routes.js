import express from 'express';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/', authenticate, authorize('INSTRUCTOR'), createLesson);
router.put('/:lessonId', authenticate, authorize('INSTRUCTOR'), updateLesson);
router.delete('/:lessonId', authenticate, authorize('INSTRUCTOR'), deleteLesson);
router.patch('/reorder', authenticate, authorize('INSTRUCTOR'), reorderLessons);

export default router;
