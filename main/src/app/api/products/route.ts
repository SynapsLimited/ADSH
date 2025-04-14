import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import Product from '@/api/lib/models/productModel';
import { uploadToVercelBlob } from '@/api/lib/blobUtils';
import { authMiddleware } from '@/api/lib/authMiddleware';

// Slugify function
const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

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

// POST handler (create a new product)
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const variations = formData.get('variations') as string;
    const variations_en = formData.get('variations_en') as string;
    const images = formData.getAll('images') as File[];

    if (!name || !category || !description || images.length === 0) {
      return NextResponse.json(
        { message: 'Fill in all fields and upload at least one image.' },
        { status: 422 }
      );
    }

    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : [];
    const variationsEnArray = variations_en ? variations_en.split(',').map((v) => v.trim()) : [];

    const imageUrls: string[] = [];
    for (const image of images) {
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      const fileName = `products/${Date.now()}-${image.name}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    const slug = slugify(name);
    const newProduct = await Product.create({
      name,
      name_en,
      category,
      slug,
      description,
      description_en,
      variations: variationsArray,
      variations_en: variationsEnArray,
      images: imageUrls,
      creator: req.user!.id,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'Something went wrong' },
      { status: 500 }
    );
  }
});

// GET handler (fetch all products or by category)
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    if (category) {
      const categoryProducts = await Product.find({ category })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json(categoryProducts, { status: 200 });
    }

    const products = await Product.find()
      .sort({ updatedAt: -1 })
      .lean();
    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    );
  }
};