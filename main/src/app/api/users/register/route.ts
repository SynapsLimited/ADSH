import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db'; // Adjust path as needed
import User from '@/api/lib/models/userModel'; // Adjust path as needed
import HttpError from '@/api/lib/errorModel'; // Adjust path as needed
import bcrypt from 'bcryptjs';

// Load allowed emails from .env
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, password2 } = body;

    if (!name || !email || !password || !password2) {
      throw new HttpError('All fields are required.', 422);
    }

    if (password !== password2) {
      throw new HttpError('Passwords do not match.', 422);
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
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      posts: 0, // Initialize posts count
      avatar: '', // Default empty avatar
    });

    return NextResponse.json(
      { _id: newUser._id, name: newUser.name, avatar: newUser.avatar, posts: newUser.posts },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/users/register:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error creating user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}