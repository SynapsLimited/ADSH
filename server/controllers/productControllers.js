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
    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    if (!name || !category || !description || !req.files || req.files.length === 0) {
      return next(new HttpError('Fill in all fields and upload at least one image.', 422));
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

    res.status(201).json(newProduct);
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
  if (!req.files || req.files.length === 0) {
    return next(new HttpError('No images uploaded.', 422));
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
// PATCH : api/products/:id
// PROTECTED
const editProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, name_en, category, description, description_en, variations, variations_en } = req.body;

    if (!name || !category || !description) {
      return next(new HttpError('Fill in all fields.', 422));
    }

    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
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
    oldProduct.name = name;
    oldProduct.name_en = name_en;
    oldProduct.category = category;
    oldProduct.description = description;
    oldProduct.description_en = description_en;
    oldProduct.variations = variationsArray;
    oldProduct.variations_en = variationsEnArray;
    oldProduct.images = newImageUrls;

    // Save the updated product
    const updatedProduct = await oldProduct.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    return next(new HttpError(error.message || "Couldn't update product", 500));
  }
};
// ======================== Delete product
// DELETE : api/products/:id
// PROTECTED
// ======================== Delete product
// DELETE : api/products/:slug
// PROTECTED
const deleteProduct = async (req, res, next) => {
  try {
    const productSlug = req.params.slug;

    // Find the product by slug
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    // Delete images from Vercel Blob storage
    for (const imageUrl of product.images) {
      await deleteFromVercelBlob(imageUrl);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(product._id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return next(new HttpError("Couldn't delete product.", 400));
  }
};


// ======================== Get single product by slug
// GET : api/products/slug/:slug
// UNPROTECTED
const getProductBySlug = async (req, res, next) => {
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

// ======================== Get single product by ID and redirect to slug
// GET : api/products/id/:id
// UNPROTECTED
const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError('Product not found.', 404));
    }

    // Redirect to slug-based URL
    res.redirect(301, `/products/${product.slug}`);
  } catch (error) {
    return next(new HttpError('Product does not exist', 404));
  }
};

// ======================== Get single product (updated to use slug)
const getProduct = async (req, res, next) => {
  const { slug } = req.params;
  return getProductBySlug(req, res, next);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getCategoryProducts,
  editProduct,
  deleteProduct,
};
