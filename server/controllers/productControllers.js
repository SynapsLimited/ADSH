// controllers/productControllers.js

const Product = require('../models/productModel');
const User = require('../models/userModel');
const HttpError = require('../models/errorModel');
const { put } = require('@vercel/blob');
const fetch = require('node-fetch');

// Utility functions to upload and delete images from Vercel Blob storage
const uploadToVercelBlob = async (fileBuffer, fileName) => {
  try {
    // Upload the file buffer to Vercel Blob storage
    const { url } = await put(fileName, fileBuffer, {
      access: 'public', // Ensure the file is publicly accessible
      token: process.env.BLOB_READ_WRITE_TOKEN, // Token with read/write access
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`, // Add Vercel API token
      },
    });

    // Log the success and return the URL
    console.log('Uploaded successfully to Vercel Blob: ', url);
    return url; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
};

const deleteFromVercelBlob = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log('No file to delete.');
      return;
    }

    const fileName = fileUrl.split('/').pop(); // Extract file name from URL
    const response = await fetch(`https://api.vercel.com/v2/blob/files/${fileName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`, // Vercel API token for authorization
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Vercel Blob Storage');
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
    const { name, category, description, variations } = req.body;

    if (!name || !category || !description || !req.files || req.files.length === 0) {
      return next(new HttpError('Fill in all fields and upload at least one image.', 422));
    }

    // Handle variations, if provided
    const variationsArray = variations ? variations.split(',').map((v) => v.trim()) : [];

    // req.files is an array of files
    const imageUrls = [];
    for (const file of req.files) {
      const fileBuffer = file.buffer;
      const fileName = `products/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
      imageUrls.push(imageUrl);
    }

    // Save the product with the image URLs
    const newProduct = await Product.create({
      name,
      category,
      description,
      variations: variationsArray,
      images: imageUrls, // Array of image URLs
      creator: req.user.id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
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

// ======================== Get single product
// GET : api/products/:id
// UNPROTECTED
const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(new HttpError('Product does not exist', 404));
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
// PATCH : api/products/:id
// PROTECTED
const editProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, category, description, variations } = req.body;

    if (!name || !category || !description) {
      return next(new HttpError('Fill in all fields.', 422));
    }

    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
      return next(new HttpError('Product not found.', 404));
    }

    // Handle variations, if provided
    const variationsArray = variations
      ? variations.split(',').map((v) => v.trim())
      : oldProduct.variations;

    let newImageUrls = oldProduct.images; // Default to old images

    // Check if new images were uploaded
    if (req.files && req.files.length > 0) {
      // Upload new images
      newImageUrls = [];
      for (const file of req.files) {
        const fileBuffer = file.buffer;
        const fileName = `products/${Date.now()}-${file.originalname}`;
        const imageUrl = await uploadToVercelBlob(fileBuffer, fileName);
        newImageUrls.push(imageUrl);
      }

      // Optionally delete old images from Vercel Blob storage
      for (const imageUrl of oldProduct.images) {
        await deleteFromVercelBlob(imageUrl);
      }
    }

    // Update the product with the new data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        category,
        description,
        variations: variationsArray,
        images: newImageUrls,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    return next(new HttpError(error.message || "Couldn't update product", 500));
  }
};

// ======================== Delete product
// DELETE : api/products/:id
// PROTECTED
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return next(new HttpError('Product unavailable.', 400));
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    // Attempt to delete the images from Vercel Blob storage
    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return next(new HttpError("Couldn't delete product.", 400));
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
