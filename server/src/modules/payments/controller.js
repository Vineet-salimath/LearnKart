import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';
import stripe from '../../config/stripe.js';
import { z } from 'zod';

const createPaymentIntentSchema = z.object({
  cartItems: z.array(z.object({
    courseId: z.string()
  })),
  couponCode: z.string().optional()
});

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const validated = createPaymentIntentSchema.parse(req.body);
  const userId = req.user.id;

  if (!validated.cartItems || validated.cartItems.length === 0) {
    return sendError(res, 'Cart is empty', 400);
  }

  // Get courses
  const courses = await db.course.findMany({
    where: {
      id: {
        in: validated.cartItems.map(item => item.courseId)
      }
    }
  });

  if (courses.length !== validated.cartItems.length) {
    return sendError(res, 'Course not found', 404);
  }

  // Check user not already enrolled
  const enrollments = await db.enrollment.findMany({
    where: {
      userId,
      courseId: {
        in: validated.cartItems.map(item => item.courseId)
      }
    }
  });

  if (enrollments.length > 0) {
    return sendError(res, 'Already enrolled in some courses', 400);
  }

  let totalAmount = courses.reduce((sum, course) => sum + (course.discountPrice || course.price), 0);
  let discount = 0;

  // Apply coupon if provided
  if (validated.couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: validated.couponCode }
    });

    if (!coupon || !coupon.isActive || coupon.expiresAt < new Date() || coupon.usedCount >= coupon.maxUses) {
      return sendError(res, 'Invalid or expired coupon', 400);
    }

    discount = Math.round(totalAmount * (coupon.discountPercent / 100));
  }

  const finalAmount = Math.max(0, totalAmount - discount);

  // Create Stripe payment intent (in cents)
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(finalAmount * 100),
    currency: 'inr',
    metadata: {
      userId,
      cartItems: JSON.stringify(validated.cartItems),
      couponCode: validated.couponCode || ''
    }
  });

  sendSuccess(res, {
    clientSecret: intent.client_secret,
    amount: finalAmount,
    discount,
    originalAmount: totalAmount
  });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, couponCode } = req.body;
  const userId = req.user.id;

  if (!paymentIntentId) {
    return sendError(res, 'Payment intent ID required', 400);
  }

  // Retrieve intent from Stripe
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!intent) {
    return sendError(res, 'Payment not found', 404);
  }

  if (intent.status !== 'succeeded') {
    return sendError(res, 'Payment not completed', 400);
  }

  const cartItems = JSON.parse(intent.metadata.cartItems);
  const appliedCoupon = intent.metadata.couponCode || couponCode;

  // Get courses
  const courses = await db.course.findMany({
    where: {
      id: {
        in: cartItems.map(item => item.courseId)
      }
    }
  });

  const user = await db.user.findUnique({
    where: { id: userId }
  });

  let totalAmount = courses.reduce((sum, course) => sum + (course.discountPrice || course.price), 0);
  let discount = 0;

  // Apply coupon logic
  if (appliedCoupon) {
    const coupon = await db.coupon.findUnique({
      where: { code: appliedCoupon }
    });

    if (coupon && coupon.isActive && coupon.expiresAt > new Date() && coupon.usedCount < coupon.maxUses) {
      discount = Math.round(totalAmount * (coupon.discountPercent / 100));
      // Increment coupon usage
      await db.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: coupon.usedCount + 1 }
      });
    }
  }

  const finalAmount = totalAmount - discount;

  // Create order
  const order = await db.order.create({
    data: {
      userId,
      totalAmount: finalAmount,
      discount,
      couponCode: appliedCoupon,
      status: 'COMPLETED',
      stripePaymentIntentId: paymentIntentId
    }
  });

  // Create order items and enrollments
  const enrollments = [];
  for (const course of courses) {
    // Create order item
    await db.orderItem.create({
      data: {
        orderId: order.id,
        courseId: course.id,
        price: course.discountPrice || course.price
      }
    });

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId: course.id
      }
    });

    enrollments.push({ id: enrollment.id, courseId: course.id });
  }

  sendSuccess(res, {
    order: {
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      courses: courses.map(c => ({ id: c.id, title: c.title }))
    },
    enrollments
  }, 'Payment confirmed', 201);
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, cartItems } = req.body;

  if (!code) {
    return sendError(res, 'Coupon code required', 400);
  }

  const coupon = await db.coupon.findUnique({
    where: { code }
  });

  if (!coupon) {
    return sendError(res, 'Coupon not found', 404);
  }

  if (!coupon.isActive) {
    return sendError(res, 'Coupon is inactive', 400);
  }

  if (coupon.expiresAt < new Date()) {
    return sendError(res, 'Coupon has expired', 400);
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return sendError(res, 'Coupon usage limit reached', 400);
  }

  // Calculate discount
  const courses = await db.course.findMany({
    where: {
      id: {
        in: cartItems.map(item => item.courseId)
      }
    }
  });

  const totalAmount = courses.reduce((sum, course) => sum + (course.discountPrice || course.price), 0);
  const discount = Math.round(totalAmount * (coupon.discountPercent / 100));

  sendSuccess(res, {
    coupon: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discount,
      finalAmount: totalAmount - discount
    }
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          course: {
            select: { id: true, title: true, thumbnail: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  sendSuccess(res, orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          course: {
            select: { id: true, title: true, thumbnail: true }
          }
        }
      }
    }
  });

  if (!order || order.userId !== userId) {
    return sendError(res, 'Order not found', 404);
  }

  sendSuccess(res, order);
});

// Webhook handler for Stripe events
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return sendError(res, 'Webhook signature verification failed', 400);
  }

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    // Orders are already created in confirmPayment, webhook is fallback
    console.log('Payment succeeded:', intent.id);
  }

  sendSuccess(res, { received: true });
});
