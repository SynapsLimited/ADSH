import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import Post from '@/api/lib/models/postModel';
import User from '@/api/lib/models/userModel';
import { uploadToVercelBlob } from '@/api/lib/blobUtils';
import { authMiddleware } from '@/api/lib/authMiddleware';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

const withAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    const authenticatedReq = req as AuthenticatedRequest;
    try {
      await authMiddleware(authenticatedReq);
      return await handler(authenticatedReq);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Authentication failed' },
        { status: error.status || 401 }
      );
    }
  };
};

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string | undefined;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string | undefined;
    const file = formData.get('thumbnail') as File;

    if (!title || !category || !description || !file) {
      return NextResponse.json(
        { message: 'Fill in all fields and choose a thumbnail.' },
        { status: 422 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `thumbnails/${Date.now()}-${file.name}`;
    const thumbnailUrl = await uploadToVercelBlob(buffer, fileName);

    const newPost = await Post.create({
      title,
      title_en,
      category,
      description,
      description_en,
      thumbnail: thumbnailUrl,
      creator: req.user!.id,
    });

    const currentUser = await User.findById(req.user!.id);
    if (currentUser) {
      currentUser.posts = (currentUser.posts || 0) + 1;
      await currentUser.save();
    }

    const populatedPost = await Post.findById(newPost._id)
      .populate('creator', '_id name')
      .lean();
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'Something went wrong' },
      { status: 500 }
    );
  }
});

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    if (category) {
      const categoryPosts = await Post.find({ category })
        .populate('creator', '_id name')
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json(categoryPosts, { status: 200 });
    }

    const posts = await Post.find()
      .populate('creator', '_id name')
      .sort({ updatedAt: -1 })
      .lean();
    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No posts found' }, { status: 404 });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    );
  }
};