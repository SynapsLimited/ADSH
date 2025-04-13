import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import User from '@/api/lib/models/userModel';
import { uploadToVercelBlob, deleteFromVercelBlob } from '@/api/lib/blobUtils';
import { authMiddleware } from '@/api/lib/authMiddleware';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

export const POST = async (req: AuthenticatedRequest) => {
  try {
    await authMiddleware(req);
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      await deleteFromVercelBlob(user.avatar);
    }

    // Upload new avatar
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `avatars/${Date.now()}-${file.name}`;
    const avatarUrl = await uploadToVercelBlob(buffer, fileName);

    // Update user with new avatar URL
    user.avatar = avatarUrl;
    await user.save();

    return NextResponse.json({ avatar: avatarUrl }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/users/change-avatar:', error);
    return NextResponse.json(
      { message: 'Error updating avatar', error: (error as Error).message },
      { status: 500 }
    );
  }
};