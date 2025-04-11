import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/userModel';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const user = await User.findById(params.id).select('name');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
}