// scripts/generateSlugs.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const slugify = require('slugify');

dotenv.config();

const generateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    const products = await Product.find({ slug: { $exists: false } });

    for (const product of products) {
      let baseSlug = slugify(product.name, { lower: true, strict: true });

      if (product.variations && product.variations.length > 0) {
        baseSlug += `-${slugify(product.variations[0], { lower: true, strict: true })}`;
      }

      // Ensure slug uniqueness
      let slug = baseSlug;
      let counter = 1;
      while (await Product.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      product.slug = slug;
      await product.save();
      console.log(`Slug generated for product: ${product.name} -> ${slug}`);
    }

    console.log('Slug generation completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error generating slugs:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

generateSlugs();
