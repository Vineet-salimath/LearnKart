import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler, generateSlug, calculateCourseDuration } from '../../utils/helpers.js';
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnail: z.string().url().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  discountPrice: z.number().min(0).optional(),
  category: z.string().min(2, 'Category required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  language: z.string().default('English'),
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([])
});

const updateCourseSchema = createCourseSchema.partial();

export const createCourse = asyncHandler(async (req, res) => {
  const validated = createCourseSchema.parse(req.body);
  const instructorId = req.user.id;

  const slug = generateSlug(validated.title);

  const course = await db.course.create({
    data: {
      ...validated,
      slug,
      instructorId,
      thumbnail: validated.thumbnail || 'https://via.placeholder.com/640x360'
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  sendSuccess(res, course, 'Course created successfully', 201);
});

export const getCourses = asyncHandler(async (req, res) => {
  const {
    category,
    level,
    search,
    page = 1,
    limit = 12,
    sort = 'newest'
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    isPublished: true,
    ...(category && { category }),
    ...(level && { level }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const sortOptions = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' }
  };

  const courses = await db.course.findMany({
    where: whereClause,
    skip,
    take: limitNum,
    orderBy: sortOptions[sort] || { createdAt: 'desc' },
    include: {
      instructor: {
        select: { id: true, name: true }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  const total = await db.course.count({ where: whereClause });

  sendSuccess(res, {
    courses,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: { id: true, name: true, avatar: true, bio: true }
      },
      sections: {
        include: {
          lessons: {
            select: { id: true, title: true, duration: true, isFree: true, order: true }
          }
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  // Check if user is enrolled (for access control)
  let isEnrolled = false;
  if (req.user) {
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: course.id
        }
      }
    });
    isEnrolled = !!enrollment;
  }

  sendSuccess(res, {
    ...course,
    isEnrolled,
    enrollmentCount: course._count.enrollments
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validated = updateCourseSchema.parse(req.body);
  const userId = req.user.id;

  // Check if user is instructor of this course
  const course = await db.course.findUnique({
    where: { id }
  });

  if (!course || course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  const updateData = { ...validated };
  if (validated.title) {
    updateData.slug = generateSlug(validated.title);
  }

  const updatedCourse = await db.course.update({
    where: { id },
    data: updateData,
    include: {
      instructor: {
        select: { id: true, name: true }
      }
    }
  });

  sendSuccess(res, updatedCourse);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await db.course.findUnique({
    where: { id }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  // Check if user is admin
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Only admins can delete courses', 403);
  }

  await db.course.delete({
    where: { id }
  });

  sendSuccess(res, null, 'Course deleted successfully');
});

export const togglePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const course = await db.course.findUnique({
    where: { id }
  });

  if (!course) {
    return sendError(res, 'Course not found', 404);
  }

  if (course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  const updated = await db.course.update({
    where: { id },
    data: {
      isPublished: !course.isPublished
    },
    include: {
      instructor: {
        select: { id: true, name: true }
      }
    }
  });

  sendSuccess(res, updated);
});

export const getMyCourses = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  const courses = await db.course.findMany({
    where: { instructorId },
    include: {
      _count: {
        select: { enrollments: true }
      },
      sections: {
        include: {
          lessons: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const coursesWithStats = courses.map(course => {
    const totalDuration = calculateCourseDuration(
      course.sections.flatMap(s => s.lessons)
    );
    return {
      ...course,
      totalDuration,
      enrollmentCount: course._count.enrollments
    };
  });

  sendSuccess(res, coursesWithStats);
});

export const getCourseStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const course = await db.course.findUnique({
    where: { id }
  });

  if (!course || course.instructorId !== userId) {
    return sendError(res, 'Unauthorized', 403);
  }

  const enrollmentCount = await db.enrollment.count({
    where: { courseId: id }
  });

  const totalRevenue = await db.orderItem.aggregate({
    where: { courseId: id },
    _sum: { price: true }
  });

  sendSuccess(res, {
    enrollmentCount,
    totalRevenue: totalRevenue._sum.price || 0
  });
});
