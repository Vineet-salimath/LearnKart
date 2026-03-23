import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getUserByEmail } from './db';

const DEV_FALLBACK_SECRET = 'dev-only-secret-change-before-production';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    return DEV_FALLBACK_SECRET;
  }
  return secret;
}

interface JWTPayload {
  userId: number;
  email: string;
  name: string;
}

export const generateToken = (userId: number, email: string, name: string): string => {
  return jwt.sign(
    { userId, email, name } as JWTPayload,
    getSecret(),
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getUserFromRequest = (request: NextRequest): JWTPayload | null => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
};
