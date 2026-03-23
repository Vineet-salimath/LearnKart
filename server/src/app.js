import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './modules/auth/routes.js';
import courseRoutes from './modules/courses/routes.js';
import sectionRoutes from './modules/sections/routes.js';
import lessonRoutes from './modules/lessons/routes.js';
import enrollmentRoutes from './modules/enrollments/routes.js';
import progressRoutes from './modules/progress/routes.js';
import paymentRoutes from './modules/payments/routes.js';
import adminRoutes from './modules/admin/routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/sections', sectionRoutes);
app.use('/api/sections/:sectionId/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
