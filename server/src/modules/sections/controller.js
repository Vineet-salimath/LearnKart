import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';
import { z } from 'zod';

const createSectionSchema = z.object({
  title: z.string().min(2, 'Title required'),
  order: z.number().int().default(0)
});

const updateSectionSchema = createSectionSchema.partial();

const reorderSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    order: z.number().int()
  }))
});

export const getSections = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  const sections = await db.section.findMany({
    where: { courseId },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });

  // Check enrollment for access control
  let isEnrolled = false;
  if (req.user) {
    isEnrolled = !!(await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    }));
  }

  // Filter free lessons if not enrolled and not instructor
  let filteredSections = sections;
  if (!isEnrolled && req.user?.id !== course.instructorId) {
    filteredSections = sections.map(section => ({
      ...section,
      lessons: section.lessons.filter(lesson => lesson.isFree)
    }));
  }

  sendSuccess(res, filteredSections);
});

export const createSection = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const validated = createSectionSchema.parse(req.body);
  const userId = req.user.id;

  // Check if user is instructor
  const course = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  if (course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  // Get next order number if not provided
  let order = validated.order;
  if (order === 0) {
    const lastSection = await db.section.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' }
    });
    order = (lastSection?.order || 0) + 1;
  }

  const section = await db.section.create({
    data: {
      ...validated,
      order,
      courseId
    }
  });

  sendSuccess(res, section, 'Section created', 201);
});

export const updateSection = asyncHandler(async (req, res) => {
  const { courseId, sectionId } = req.params;
  const validated = updateSectionSchema.parse(req.body);
  const userId = req.user.id;

  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: { course: true }
  });

  if (!section) {
    return sendError(res, 'Section not found', 404);
  }

  if (section.course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  const updated = await db.section.update({
    where: { id: sectionId },
    data: validated
  });

  sendSuccess(res, updated);
});

export const deleteSection = asyncHandler(async (req, res) => {
  const { courseId, sectionId } = req.params;
  const userId = req.user.id;

  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: { course: true }
  });

  if (!section) {
    return sendError(res, 'Section not found', 404);
  }

  if (section.course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  await db.section.delete({
    where: { id: sectionId }
  });

  sendSuccess(res, null, 'Section deleted');
});

export const reorderSections = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const validated = reorderSchema.parse(req.body);
  const userId = req.user.id;

  const course = await db.course.findUnique({
    where: { id: courseId }
  });

  if (!course || course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  // Update all sections
  for (const section of validated.sections) {
    await db.section.update({
      where: { id: section.id },
      data: { order: section.order }
    });
  }

  const sections = await db.section.findMany({
    where: { courseId },
    orderBy: { order: 'asc' }
  });

  sendSuccess(res, sections);
});
