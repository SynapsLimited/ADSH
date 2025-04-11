import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Post from '../lib/models/postModel';
import User from '../lib/models/userModel';
import HttpError from '../lib/errorModel';
import { authMiddleware } from '../lib/authMiddleware';
import { uploadToVercelBlob, deleteFromVercelBlob } from '../lib/blobUtils';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    await authMiddleware(req);
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string | undefined;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string | undefined;
    const file = formData.get('thumbnail') as File;

    if (!title || !category || !description || !file) {
      throw new HttpError('Fill in all fields and choose a thumbnail.', 422);
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
    currentUser.posts += 1;
    await currentUser.save();

    // Populate creator for response
    const populatedPost = await Post.findById(newPost._id).populate('creator', '_id name');
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Something went wrong' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { pathname } = req.nextUrl;
  const segments = pathname.split('/');

  try {
    if (segments.length === 3) {
      // /api/posts
      const posts = await Post.find().populate('creator', '_id name').sort({ updatedAt: -1 });
      return NextResponse.json(posts);
    } else if (segments[3] === 'categories' && segments[4]) {
      // /api/posts/categories/:category
      const category = segments[4];
      const catPosts = await Post.find({ category }).populate('creator', '_id name').sort({ createdAt: -1 });
      return NextResponse.json(catPosts);
    } else if (segments[3] === 'users' && segments[4]) {
      // /api/posts/users/:id
      const id = segments[4];
      const posts = await Post.find({ creator: id }).populate('creator', '_id name').sort({ createdAt: -1 });
      return NextResponse.json(posts);
    } else if (segments[3]) {
      // /api/posts/:id
      const postId = segments[3];
      const post = await Post.findById(postId).populate('creator', '_id name');
      if (!post) throw new HttpError('Post not found.', 404);
      return NextResponse.json(post);
    }
    throw new HttpError('Invalid route.', 400);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || 'Error' },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    await authMiddleware(req);
    const postId = req.nextUrl.pathname.split('/')[3];
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string | undefined;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string | undefined;
    const file = formData.get('thumbnail') as File | null;

    if (!title || !category || !description) {
      throw new HttpError('Fill in all fields.', 422);
    }

    const oldPost = await Post.findById(postId);
    if (!oldPost) throw new HttpError('Post not found.', 404);
    if (oldPost.creator.toString() !== req.user!.id) {
      throw new HttpError('Unauthorized to edit this post.', 403);
    }

    let thumbnailUrl = oldPost.thumbnail;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `thumbnails/${Date.now()}-${file.name}`;
      thumbnailUrl = await uploadToVercelBlob(buffer, fileName);
      if (oldPost.thumbnail) await deleteFromVercelBlob(oldPost.thumbnail);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, title_en, category, description, description_en, thumbnail: thumbnailUrl },
      { new: true }
    ).populate('creator', '_id name');

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || "Couldn't update post" },
      { status: (error as HttpError).code || 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  try {
    await authMiddleware(req);
    const postId = req.nextUrl.pathname.split('/')[3];
    if (!postId) throw new HttpError('Post unavailable.', 400);

    const post = await Post.findById(postId);
    if (!post) throw new HttpError('Post not found.', 404);
    if (post.creator.toString() !== req.user!.id) {
      throw new HttpError('Unauthorized to delete this post.', 403);
    }

    if (post.thumbnail) await deleteFromVercelBlob(post.thumbnail);
    await Post.findByIdAndDelete(postId);

    const currentUser = await User.findById(req.user!.id);
    currentUser.posts -= 1;
    await currentUser.save();

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { message: (error as HttpError).message || "Couldn't delete post" },
      { status: (error as HttpError).code || 400 }
    );
  }
}