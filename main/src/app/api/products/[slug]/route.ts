import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/lib/db';
import Product, { IProduct } from '@/api/lib/models/productModel'; // IProduct is now exported
import { authMiddleware } from '@/api/lib/authMiddleware';
import { uploadToVercelBlob, deleteFromVercelBlob } from '@/api/lib/blobUtils';

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

// GET handler (fetch a single product by slug)
export const GET = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();
    const { slug } = await params;
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

// PATCH handler (update a product by slug)
export const PATCH = async (
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await authMiddleware(req);
    await connectDB();
    const { slug } = await params;
    const product = (await Product.findOne({ slug })) as IProduct | null;
    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    if (product.creator.toString() !== req.user!.id) {
      return NextResponse.json({ message: 'Unauthorized to edit this product.' }, { status: 403 });
    }

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

    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : product.variations;
    const variationsEnArray = variations_en
      ? variations_en.split(',').map((v) => v.trim())
      : product.variations_en;

    let newImageUrls = product.images;
    if (images.length > 0) {
      newImageUrls = [];
      for (const image of images) {
        const fileBuffer = Buffer.from(await image.arrayBuffer());
        const fileName = `products/${Date.now()}-${image.name}`;
        const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
        newImageUrls.push(imageUrl);
      }
      for (const imageUrl of product.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    product.name = name;
    product.name_en = name_en || '';
    product.category = category;
    product.slug = slugify(name);
    product.description = description;
    product.description_en = description_en || '';
    product.variations = variationsArray;
    product.variations_en = variationsEnArray;
    product.images = newImageUrls;
    product.updatedAt = new Date();

    const updatedProduct = await product.save();
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/products/[slug]:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't update product" },
      { status: 500 }
    );
  }
};

// DELETE handler (delete a product by slug)
export const DELETE = async (
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await authMiddleware(req);
    await connectDB();
    const { slug } = await params;
    const product = (await Product.findOne({ slug })) as IProduct | null;
    if (!product) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    if (product.creator.toString() !== req.user!.id) {
      return NextResponse.json({ message: 'Unauthorized to delete this product.' }, { status: 403 });
    }
    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }
    await Product.findByIdAndDelete(product._id);
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/products/[slug]:', error);
    return NextResponse.json(
      { message: (error as Error).message || "Couldn't delete product" },
      { status: 500 }
    );
  }
};