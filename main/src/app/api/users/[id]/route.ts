import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/userModel';
import mongoose from 'mongoose';

// GET handler for fetching a user by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Await the params promise to get the id

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findById(id).select('name avatar posts').lean();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/users/[id]:`, error);
    return NextResponse.json(
      { message: 'Error fetching user', error: (error as Error).message },
      { status: 500 }
    );
  }
}