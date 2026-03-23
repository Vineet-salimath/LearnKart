import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';
import { z } from 'zod';

const createCouponSchema = z.object({
  code: z.string().min(2).max(50),
  discountPercent: z.number().min(1).max(100),
  maxUses: z.number().int().min(1),
  expiresAt: z.string().datetime()
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const totalUsers = await db.user.count();
  const totalCourses = await db.course.count();
  const totalOrders = await db.order.count();

  const revenue = await db.order.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true }
  });

  sendSuccess(res, {
    totalUsers,
    totalCourses,
    totalOrders,
    totalRevenue: revenue._sum.totalAmount || 0
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { role, search, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const users = await db.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    skip,
    take: limitNum,
    orderBy: { createdAt: 'desc' }
  });

  const total = await db.user.count({ where: whereClause });

  sendSuccess(res, {
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { userId } = req.params;
  const { role } = req.body;

  if (!['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
    return sendError(res, 'Invalid role', 400);
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { role }
  });

  sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

export const getCourses = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { search, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    ...(search && {
      title: { contains: search, mode: 'insensitive' }
    })
  };

  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      instructor: {
        select: { name: true, email: true }
      },
      _count: {
        select: { enrollments: true }
      }
    },
    skip,
    take: limitNum,
    orderBy: { createdAt: 'desc' }
  });

  const total = await db.course.count({ where: whereClause });

  sendSuccess(res, {
    courses: courses.map(c => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor.name,
      enrollments: c._count.enrollments,
      isPublished: c.isPublished,
      createdAt: c.createdAt
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { status, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {
    ...(status && { status })
  };

  const orders = await db.order.findMany({
    where: whereClause,
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: {
        select: { course: { select: { title: true } } }
      }
    },
    skip,
    take: limitNum,
    orderBy: { createdAt: 'desc' }
  });

  const total = await db.order.count({ where: whereClause });

  sendSuccess(res, {
    orders: orders.map(o => ({
      id: o.id,
      studentName: o.user.name,
      studentEmail: o.user.email,
      totalAmount: o.totalAmount,
      status: o.status,
      courses: o.items.map(i => i.course.title).join(', '),
      createdAt: o.createdAt
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const validated = createCouponSchema.parse(req.body);

  // Check if coupon code already exists
  const existing = await db.coupon.findUnique({
    where: { code: validated.code }
  });

  if (existing) {
    return sendError(res, 'Coupon code already exists', 409);
  }

  const coupon = await db.coupon.create({
    data: {
      ...validated,
      expiresAt: new Date(validated.expiresAt)
    }
  });

  sendSuccess(res, coupon, 'Coupon created', 201);
});

export const getCoupons = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  sendSuccess(res, coupons);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { id } = req.params;
  const { isActive } = req.body;

  const coupon = await db.coupon.update({
    where: { id },
    data: { isActive }
  });

  sendSuccess(res, coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Admins only', 403);
  }

  const { id } = req.params;

  await db.coupon.delete({
    where: { id }
  });

  sendSuccess(res, null, 'Coupon deleted');
});
