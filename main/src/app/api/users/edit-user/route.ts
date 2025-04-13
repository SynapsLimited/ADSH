import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import User from '@/api/lib/models/userModel';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '@/api/lib/authMiddleware';

interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

export const PATCH = async (req: AuthenticatedRequest) => {
  try {
    await authMiddleware(req);
    await connectDB();

    const body = await req.json();
    const { name, email, currentPassword, newPassword, confirmNewPassword } = body;

    const user = await User.findById(req.user!.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password is required to change password.' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Current password is incorrect.' }, { status: 401 });
      }
      if (newPassword !== confirmNewPassword) {
        return NextResponse.json({ message: 'New passwords do not match.' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update name and email if provided
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    return NextResponse.json({ message: 'User updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/users/edit-user:', error);
    return NextResponse.json(
      { message: 'Error updating user', error: (error as Error).message },
      { status: 500 }
    );
  }
};