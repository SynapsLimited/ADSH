import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db'; // Adjust path as needed
import Post from '@/api/lib/models/postModel'; // Adjust path as needed
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Await the params promise

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid user ID.' }, { status: 400 });
    }

    const posts = await Post.find({ creator: id })
      .select('_id thumbnail title title_en description description_en creator createdAt category')
      .populate('creator', '_id name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/users/[id]:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'Error fetching posts' },
      { status: 500 }
    );
  }
}