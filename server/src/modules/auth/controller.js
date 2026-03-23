import db from '../../config/database.js';
import { sendSuccess, sendError, asyncHandler } from '../../utils/helpers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required')
});

export const register = asyncHandler(async (req, res) => {
  const validated = registerSchema.parse(req.body);

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email: validated.email }
  });

  if (existingUser) {
    return sendError(res, 'Email already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validated.password, 12);

  // Create user
  const user = await db.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: validated.role
    }
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );

  // Store refresh token in DB
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry
    }
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken
  }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const validated = loginSchema.parse(req.body);

  const user = await db.user.findUnique({
    where: { email: validated.email }
  });

  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(validated.password, user.password);

  if (!passwordMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );

  // Store refresh token in DB
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry
    }
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendError(res, 'Refresh token not found', 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in DB
    const storedToken = await db.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return sendError(res, 'Refresh token expired', 401);
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    // Delete old refresh token and create new one
    await db.refreshToken.delete({
      where: { token: refreshToken }
    });

    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await db.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry
      }
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, { accessToken: newAccessToken });
  } catch (error) {
    sendError(res, 'Invalid refresh token', 401);
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await db.refreshToken.delete({
      where: { token: refreshToken }
    }).catch(() => null);
  }

  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logout successful');
});

export const me = asyncHandler(async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
      createdAt: true
    }
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, user);
});
