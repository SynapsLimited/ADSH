import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../lib/db';
import User from '../lib/models/userModel';
import HttpError from '../lib/errorModel';
import { authMiddleware } from '../lib/authMiddleware';
import bcrypt from 'bcryptjs';

// Load allowed emails from .env
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function GET(req: NextRequest) {
  await connectDB();
  const { pathname } = req.nextUrl;
  const segments = pathname.split('/');

  try {
    if (segments.length === 3 && segments[2]) {
      const userId = segments[2];
      const user = await User.findById(userId).select('name');
      if (!user) {
        throw new HttpError('User not found.', 404);
      }
      return NextResponse.json({ name: user.name });
    } else {
      const users = await User.find().select('name');
      return NextResponse.json(users);
    }
  } catch (error) {
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error fetching user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw new HttpError('Name, email, and password are required.', 422);
    }

    // Check if email is allowed to register
    if (!ALLOWED_EMAILS.includes(email)) {
      throw new HttpError('Email not authorized for registration.', 403);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError('User with this email already exists.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error creating user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    await authMiddleware(req);
    const userId = req.nextUrl.pathname.split('/')[3];
    const body = await req.json();
    const { name, email, password } = body;

    if (!userId) {
      throw new HttpError('User ID is required.', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError('User not found.', 404);
    }

    if (req.user!.id !== userId) {
      throw new HttpError('Unauthorized: You can only update your own profile.', 403);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password: password ? await bcrypt.hash(password, 10) : user.password },
      { new: true }
    );
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error updating user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    await authMiddleware(req);
    const userId = req.nextUrl.pathname.split('/')[3];

    if (!userId) {
      throw new HttpError('User ID is required.', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError('User not found.', 404);
    }

    if (req.user!.id !== userId) {
      throw new HttpError('Unauthorized: You can only delete your own profile.', 403);
    }

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error deleting user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}