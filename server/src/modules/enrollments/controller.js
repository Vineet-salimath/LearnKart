import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';

export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  if (!courseId) {
    return sendError(res, 'Course ID required', 400);
  }

  // Check if course exists
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { instructor: { select: { name: true } } }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  // For paid courses, enrollment must be through payment
  if (course.price > 0) {
    return sendError(res, 'Paid courses require payment', 400);
  }

  // Check if already enrolled
  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  if (existing) {
    return sendError(res, 'Already enrolled in this course', 409);
  }

  // Get user for email
  const user = await db.user.findUnique({
    where: { id: userId }
  });

  // Create enrollment
  const enrollment = await db.enrollment.create({
    data: {
      userId,
      courseId
    }
  });

  sendSuccess(res, enrollment, 'Enrolled successfully', 201);
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { id: true, name: true } },
          sections: {
            include: {
              lessons: true
            }
          }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });

  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.sections.reduce(
        (sum, section) => sum + section.lessons.length,
        0
      );

      const completedLessons = await db.progress.count({
        where: {
          userId,
          completed: true,
          lesson: {
            section: {
              courseId: enrollment.course.id
            }
          }
        }
      });

      return {
        ...enrollment,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      };
    })
  );

  sendSuccess(res, coursesWithProgress);
});

export const checkEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  sendSuccess(res, {
    isEnrolled: !!enrollment
  });
});

export const unenrollStudent = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;

  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Only admins can unenroll', 403);
  }

  await db.enrollment.delete({
    where: {
      userId_courseId: {
        userId: studentId,
        courseId
      }
    }
  }).catch(() => {
    throw { statusCode: 404, message: 'Enrollment not found' };
  });

  sendSuccess(res, null, 'Student unenrolled');
});
