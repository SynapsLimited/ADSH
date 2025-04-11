import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import HttpError from './errorModel';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

export const authMiddleware = async (req: AuthenticatedRequest) => {
  const authorization = req.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new HttpError('Unauthorized. No token provided.', 401);
  }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; name: string };
    req.user = decoded;
    return null; // Proceed
  } catch (err) {
    throw new HttpError('Unauthorized. Invalid token.', 403);
  }
};