import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import User from '@/api/lib/models/userModel';
import HttpError from '@/api/lib/errorModel';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      throw new HttpError('Invalid user ID.', 400);
    }

    const user = await User.findById(id)
      .select('_id name email avatar posts') // Added email
      .lean();
    if (!user) {
      throw new HttpError('User not found.', 404);
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error fetching user' },
      { status: (error as HttpError).code || 500 }
    );
  }
}