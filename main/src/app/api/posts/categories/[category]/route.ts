import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db'; // Adjust path as needed
import Post from '@/api/lib/models/postModel';

export async function GET(req: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  try {
    await connectDB();
    const { category } = await params;

    const posts = await Post.find({ category })
      .populate('creator', '_id name avatar') // Populate creator with _id, name, and avatar
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/categories/[category]:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'Error fetching posts' },
      { status: 500 }
    );
  }
}