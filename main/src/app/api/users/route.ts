import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import User from '@/api/lib/models/userModel';
import HttpError from '@/api/lib/errorModel';
import bcrypt from 'bcryptjs';

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const users = await User.find()
      .select('_id name avatar posts')
      .lean();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error fetching users' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw new HttpError('Name, email, and password are required.', 422);
    }

    if (!ALLOWED_EMAILS.includes(email)) {
      throw new HttpError('Email not authorized for registration.', 403);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError('User with this email already exists.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      posts: 0,
      avatar: '',
    });
    return NextResponse.json(
      { _id: newUser._id, name: newUser.name, avatar: newUser.avatar, posts: newUser.posts },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error creating user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}