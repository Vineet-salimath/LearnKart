import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  applyCoupon,
  getOrders,
  getOrder,
  stripeWebhook
} from './controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Webhook (no auth needed, but Stripe signature verified)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/create-payment-intent', authenticate, authorize('STUDENT'), createPaymentIntent);
router.post('/confirm', authenticate, authorize('STUDENT'), confirmPayment);
router.post('/apply-coupon', authenticate, authorize('STUDENT'), applyCoupon);
router.get('/orders', authenticate, authorize('STUDENT'), getOrders);
router.get('/orders/:orderId', authenticate, authorize('STUDENT'), getOrder);

export default router;
