// controllers/productControllers.js

const Product = require('../models/productModel');
const User = require('../models/userModel');
const HttpError = require('../models/errorModel');
const { put } = require('@vercel/blob');
const fetch = require('node-fetch');

// Utility functions to upload and delete images from Vercel Blob storage
const uploadToVercelBlob = async (fileBuffer, fileName) => {
  try {
    console.log(`Uploading file: ${fileName} to Vercel Blob`);
    const { url } = await put(fileName, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    });
    console.log('Uploaded successfully to Vercel Blob:', url);
    return url;
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }
};

const deleteFromVercelBlob = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('No file URL provided for deletion.');
      return;
    }
    const fileName = fileUrl.split('/').pop();
    console.log(`Deleting file from Vercel Blob: ${fileName}`);
    const response = await fetch(`https://api.vercel.com/v2/blob/files/${fileName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete ${fileName}: ${errorText}`);
    }
    console.log(`Deleted successfully from Vercel Blob: ${fileName}`);
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
  }
};

// ======================== Create a product
// POST : api/products
// PROTECTED
const createProduct = async (req, res, next) => {
  try {
    console.log('Received createProduct request:', {
      body: req.body,
      files: req.files ? req.files.map(f => f.originalname) : 'No files',
    });

    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    if (!name || !category || !description) {
      console.log('Missing required fields:', { name, category, description });
      return next(new HttpError('Fill in all required fields: name, category, description.', 422));
    }

    if (!req.files || req.files.length === 0) {
      console.log('No images uploaded.');
      return next(new HttpError('Upload at least one image.', 422));
    }

    // Handle variations, if provided
    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : [];
    const variationsEnArray = variations_en ? variations_en.split(',').map((v) => v.trim()) : [];

    // Upload images
    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `products/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    console.log('Creating product with data:', {
      name,
      name_en,
      category,
      description,
      description_en,
      variations: variationsArray,
      variations_en: variationsEnArray,
      images: imageUrls,
      creator: req.user.id,
    });

    // Save the product with the image URLs
    const newProduct = await Product.create({
      name,
      name_en,
      category,
      description,
      description_en,
      variations: variationsArray,
      variations_en: variationsEnArray,
      images: imageUrls,
      creator: req.user.id,
    });

    console.log('Product created successfully:', newProduct._id);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return next(new HttpError(error.message || 'Failed to create product', 500));
  }
};

// ======================== Get all products
// GET : api/products
// UNPROTECTED
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======================== Get products by Category
// GET : api/products/categories/:category
// UNPROTECTED
const getCategoryProducts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryProducts = await Product.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(categoryProducts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ======================== Edit product
// PATCH : api/products/:slug/edit
// PROTECTED
const editProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;
    console.log('Editing product with slug:', productSlug);

    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    if (!name || !category || !description) {
      console.log('Missing required fields:', { name, category, description });
      return next(new HttpError('Fill in all fields.', 422));
    }

    const oldProduct = await Product.findOne({ slug: productSlug });
    if (!oldProduct) {
      console.log('Product not found for slug:', productSlug);
      return next(new HttpError('Product not found.', 404));
    }

    // Handle variations
    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : oldProduct.variations;
    const variationsEnArray = variations_en
      ? variations_en.split(',').map((v) => v.trim())
      : oldProduct.variations_en;

    let newImageUrls = oldProduct.images;

    // Check if new images were uploaded
    if (req.files && req.files.length > 0) {
      console.log('New images uploaded:', req.files.map(f => f.originalname));
      newImageUrls = [];
      for (const file of req.files) {
        const fileBuffer = file.buffer;
        const fileName = `products/${Date.now()}-${file.originalname}`;
        const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
        newImageUrls.push(imageUrl);
      }

      // Delete old images
      for (const imageUrl of oldProduct.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    // Update the product
    oldProduct.name = name;
    oldProduct.name_en = name_en;
    oldProduct.category = category;
    oldProduct.description = description;
    oldProduct.description_en = description_en;
    oldProduct.variations = variationsArray;
    oldProduct.variations_en = variationsEnArray;
    oldProduct.images = newImageUrls;

    const updatedProduct = await oldProduct.save();
    console.log('Product updated successfully:', updatedProduct._id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in editProduct:', error);
    return next(new HttpError(error.message || "Couldn't update product", 500));
  }
};

// ======================== Delete product
// DELETE : api/products/:slug
// PROTECTED
const deleteProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    await Product.findByIdAndDelete(product._id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return next(new HttpError("Couldn't delete product.", 400));
  }
};

// ======================== Get single product by slug
// GET : api/products/:slug
// UNPROTECTED
const getProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;
    const product = await Product.findOne({ slug: productSlug }).populate('creator', 'name email');

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(new HttpError('Product does not exist', 404));
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getCategoryProducts,
  editProduct,
  deleteProduct,
};