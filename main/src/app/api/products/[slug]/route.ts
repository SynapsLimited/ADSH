import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import mongoose from 'mongoose';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    // Connect to the database and register models
    await connectDB();

    // Access the Product model
    const Product = mongoose.model('Product');

    // Get the slug from params
    const { slug } = await params;

    // Find the product by slug and populate the creator field
    const product = await Product.findOne({ slug }).populate('creator', 'name email').lean();

    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    );
  }
};