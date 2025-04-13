import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/userModel';

// GET handler for fetching a user by ID
export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extract id from URL (e.g., /api/users/123)
    if (!id) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    const user = await User.findById(id).select('name');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
}