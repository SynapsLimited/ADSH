import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; name: string };
    return NextResponse.json({ user: { _id: decoded.id, name: decoded.name } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}