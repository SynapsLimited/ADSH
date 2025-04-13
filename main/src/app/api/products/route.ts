import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db'; // Adjust path if necessary
import Product from '@/api/lib/models/productModel'; // Adjust path if necessary
import User from '@/api/lib/models/userModel'; // Adjust path if necessary
import { uploadToVercelBlob, deleteFromVercelBlob } from '@/api/lib/blobUtils'; // Adjust path if necessary
import { authMiddleware } from '@/api/lib/authMiddleware'; // Adjust path if necessary
import mongoose from 'mongoose';

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

// Define AuthenticatedRequest type to match authMiddleware
interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; name: string };
}

// Helper function to wrap route handlers with authMiddleware
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

    const slug = slugify(name); // Generate slug
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

// PATCH handler (update a product)
export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const url = new URL(req.url);
    const slug = url.pathname.split('/')[3];
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const variations = formData.get('variations') as string;
    const variations_en = formData.get('variations_en') as string;
    const images = formData.getAll('images') as File[];

    if (!name || !category || !description) {
      return NextResponse.json({ message: 'Fill in all fields.' }, { status: 422 });
    }

    const oldProduct = await Product.findOne({ slug });
    if (!oldProduct) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : oldProduct.variations;
    const variationsEnArray = variations_en ? variations_en.split(',').map((v) => v.trim()) : oldProduct.variations_en;

    let newImageUrls = oldProduct.images;
    if (images.length > 0) {
      newImageUrls = [];
      for (const image of images) {
        const fileBuffer = Buffer.from(await image.arrayBuffer());
        const fileName = `products/${Date.now()}-${image.name}`;
        const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
        newImageUrls.push(imageUrl);
      }
      for (const imageUrl of oldProduct.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    oldProduct.name = name;
    oldProduct.name_en = name_en;
    oldProduct.category = category;
    oldProduct.slug = slugify(name); // Update slug if name changes
    oldProduct.description = description;
    oldProduct.description_en = description_en;
    oldProduct.variations = variationsArray;
    oldProduct.variations_en = variationsEnArray;
    oldProduct.images = newImageUrls;
    oldProduct.updatedAt = new Date();

    const updatedProduct = await oldProduct.save();
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/products:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't update product" },
      { status: 500 }
    );
  }
});

// DELETE handler (delete a product)
export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();
    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }
    await Product.findByIdAndDelete(product._id);
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't delete product" },
      { status: 500 }
    );
  }
});

