import express from 'express';
import {
  markLessonComplete,
  getCourseProgress,
  getLastWatchedLesson,
  getLessonProgress
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.post('/lesson/:lessonId/complete', authenticate, authorize('STUDENT'), markLessonComplete);
router.get('/course/:courseId', authenticate, authorize('STUDENT'), getCourseProgress);
router.get('/course/:courseId/last-watched', authenticate, authorize('STUDENT'), getLastWatchedLesson);
router.get('/lesson/:lessonId', authenticate, getLessonProgress);

export default router;
