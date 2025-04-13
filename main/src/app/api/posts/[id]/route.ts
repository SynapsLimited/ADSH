import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import Post from '@/api/lib/models/postModel';
import User from '@/api/lib/models/userModel';
import { uploadToVercelBlob, deleteFromVercelBlob } from '@/api/lib/blobUtils';
import { authMiddleware } from '@/api/lib/authMiddleware';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

const withAuth = (
  handler: (req: AuthenticatedRequest, id: string) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const authenticatedReq = req as AuthenticatedRequest;
    try {
      await authMiddleware(authenticatedReq);
      const { id } = await context.params;
      return await handler(authenticatedReq, id);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Authentication failed' },
        { status: error.status || 401 }
      );
    }
  };
};

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid post ID.' }, { status: 400 });
    }

    const post = await Post.findById(id).populate('creator', '_id name').lean();
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth(async (req: AuthenticatedRequest, id: string) => {
  try {
    await connectDB();
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid post ID.' }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string | undefined;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string | undefined;
    const file = formData.get('thumbnail') as File | null;

    if (!title || !category || !description) {
      return NextResponse.json({ message: 'Fill in all fields.' }, { status: 422 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    if (post.creator.toString() !== req.user!.id) {
      return NextResponse.json({ message: 'Unauthorized to edit this post.' }, { status: 403 });
    }

    let thumbnailUrl = post.thumbnail;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `thumbnails/${Date.now()}-${file.name}`;
      thumbnailUrl = await uploadToVercelBlob(buffer, fileName);
      if (post.thumbnail) {
        await deleteFromVercelBlob(post.thumbnail);
      }
    }

    post.title = title;
    post.title_en = title_en;
    post.category = category;
    post.description = description;
    post.description_en = description_en;
    post.thumbnail = thumbnailUrl;
    post.updatedAt = new Date();

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id)
      .populate('creator', '_id name')
      .lean();

    return NextResponse.json(populatedPost, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/posts/[id]:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't update post" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest, id: string) => {
  try {
    await connectDB();
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid post ID.' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    if (post.creator.toString() !== req.user!.id) {
      return NextResponse.json({ message: 'Unauthorized to delete this post.' }, { status: 403 });
    }

    if (post.thumbnail) {
      await deleteFromVercelBlob(post.thumbnail);
    }

    await Post.findByIdAndDelete(id);

    const currentUser = await User.findById(req.user!.id);
    if (currentUser) {
      currentUser.posts = Math.max(0, (currentUser.posts || 0) - 1);
      await currentUser.save();
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't delete post" },
      { status: 500 }
    );
  }
});