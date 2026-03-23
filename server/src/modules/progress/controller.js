import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';

export const markLessonComplete = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  // Check if lesson exists
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: true }
  });

  if (!lesson) {
    return sendError(res, 'Lesson not found', 404);
  }

  // Check if user is enrolled in the course
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: lesson.section.courseId
      }
    }
  });

  if (!enrollment) {
    return sendError(res, 'Not enrolled in this course', 403);
  }

  // Upsert progress (idempotent)
  const progress = await db.progress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId
      }
    },
    update: {
      completed: true,
      watchedAt: new Date()
    },
    create: {
      userId,
      lessonId,
      completed: true
    }
  });

  sendSuccess(res, progress, 'Lesson marked complete');
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  // Check if user is enrolled
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  if (!enrollment) {
    return sendError(res, 'Not enrolled in this course', 403);
  }

  // Get all lessons in course
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          lessons: true
        }
      }
    }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  const allLessons = course.sections.flatMap(s => s.lessons);
  const totalLessons = allLessons.length;

  // Get completed lessons
  const completedProgress = await db.progress.findMany({
    where: {
      userId,
      completed: true,
      lesson: {
        section: {
          courseId
        }
      }
    }
  });

  const completedLessons = completedProgress.length;
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  sendSuccess(res, {
    completedLessons,
    totalLessons,
    percentage
  });
});

export const getLastWatchedLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  // Check if enrolled
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  if (!enrollment) {
    return sendError(res, 'Not enrolled in this course', 403);
  }

  // Get most recent watched lesson
  const lastWatched = await db.progress.findFirst({
    where: {
      userId,
      lesson: {
        section: {
          courseId
        }
      }
    },
    include: {
      lesson: {
        include: {
          section: true
        }
      }
    },
    orderBy: { watchedAt: 'desc' }
  });

  if (!lastWatched) {
    // Return first lesson if nothing watched yet
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              take: 1
            }
          },
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    });

    const firstLesson = course?.sections[0]?.lessons[0];
    return sendSuccess(res, {
      lastWatchedLessonId: firstLesson?.id || null
    });
  }

  sendSuccess(res, {
    lastWatchedLessonId: lastWatched.lesson.id
  });
});

export const getLessonProgress = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  const progress = await db.progress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId
      }
    }
  });

  sendSuccess(res, {
    completed: progress?.completed || false,
    lessonId
  });
});
