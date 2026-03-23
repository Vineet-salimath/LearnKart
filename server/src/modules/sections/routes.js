import express from 'express';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/', getSections);
router.post('/', authenticate, authorize('INSTRUCTOR'), createSection);
router.put('/:sectionId', authenticate, authorize('INSTRUCTOR'), updateSection);
router.delete('/:sectionId', authenticate, authorize('INSTRUCTOR'), deleteSection);
router.patch('/reorder', authenticate, authorize('INSTRUCTOR'), reorderSections);

export default router;
