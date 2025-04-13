import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load allowed emails from .env
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email)) {
      return NextResponse.json({ message: 'Email not authorized for login.' }, { status: 403 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { token, user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/users/login:', error);
    return NextResponse.json(
      { message: 'Error logging in', error: (error as Error).message },
      { status: 500 }
    );
  }
}