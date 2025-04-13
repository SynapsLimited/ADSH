import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import Post from '@/api/lib/models/postModel';
import mongoose from 'mongoose';
import { authMiddleware } from '@/api/lib/authMiddleware';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

export const GET = async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await authMiddleware(req);
    await connectDB();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid user ID.' }, { status: 400 });
    }

    const posts = await Post.find({ creator: id })
      .select('_id title thumbnail')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/users/[id]:', error);
    return NextResponse.json(
      { message: 'Error fetching posts', error: (error as Error).message },
      { status: 500 }
    );
  }
};