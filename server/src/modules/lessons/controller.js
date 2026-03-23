import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler, extractYouTubeId, isValidYoutubeUrl } from '../../utils/helpers.js';
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(2, 'Title required'),
  youtubeUrl: z.string().refine(
    url => isValidYoutubeUrl(url),
    'Invalid YouTube URL'
  ),
  duration: z.number().int().min(0).default(0),
  isFree: z.boolean().default(false),
  order: z.number().int().default(0)
});

const updateLessonSchema = createLessonSchema.omit({ order: true }).partial();

const reorderSchema = z.object({
  lessons: z.array(z.object({
    id: z.string(),
    order: z.number().int()
  }))
});

export const createLesson = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const validated = createLessonSchema.parse(req.body);
  const userId = req.user.id;

  // Check authorization
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

  // Extract YouTube ID
  const youtubeId = extractYouTubeId(validated.youtubeUrl);

  // Get next order if not provided
  let order = validated.order;
  if (order === 0) {
    const lastLesson = await db.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    });
    order = (lastLesson?.order || 0) + 1;
  }

  const lesson = await db.lesson.create({
    data: {
      title: validated.title,
      youtubeUrl: youtubeId,
      duration: validated.duration,
      isFree: validated.isFree,
      order,
      sectionId
    }
  });

  sendSuccess(res, lesson, 'Lesson created', 201);
});

export const updateLesson = asyncHandler(async (req, res) => {
  const { sectionId, lessonId } = req.params;
  const validated = updateLessonSchema.parse(req.body);
  const userId = req.user.id;

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } }
  });

  if (!lesson) {
    return sendError(res, 'Lesson not found', 404);
  }

  if (lesson.section.course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  const updateData = { ...validated };
  if (validated.youtubeUrl) {
    updateData.youtubeUrl = extractYouTubeId(validated.youtubeUrl);
  }

  const updated = await db.lesson.update({
    where: { id: lessonId },
    data: updateData
  });

  sendSuccess(res, updated);
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const { sectionId, lessonId } = req.params;
  const userId = req.user.id;

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } }
  });

  if (!lesson) {
    return sendError(res, 'Lesson not found', 404);
  }

  if (lesson.section.course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  await db.lesson.delete({
    where: { id: lessonId }
  });

  sendSuccess(res, null, 'Lesson deleted');
});

export const reorderLessons = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const validated = reorderSchema.parse(req.body);
  const userId = req.user.id;

  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: { course: true }
  });

  if (!section || section.course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  // Update all lessons
  for (const lesson of validated.lessons) {
    await db.lesson.update({
      where: { id: lesson.id },
      data: { order: lesson.order }
    });
  }

  const lessons = await db.lesson.findMany({
    where: { sectionId },
    orderBy: { order: 'asc' }
  });

  sendSuccess(res, lessons);
});
