// models/productModel.js

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    name_en: { type: String },
    category: {
      type: String,
      enum: ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Dried Fruits', 'Equipment', 'Other'],
      required: true,
      message: '{VALUE} is not supported',
    },
    description: { type: String, required: true },
    description_en: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String, required: true }], // Array of image URLs
    variations: [{ type: String }],
    variations_en: [{ type: String }],
    slug: { type: String, required: true, unique: true }, // Slug field
    previousSlugs: [{ type: String }], // To store old slugs for redirection
  },
  { timestamps: true }
);

// Pre-validate middleware to generate or regenerate slug
productSchema.pre('validate', async function (next) {
  if (this.isModified('name') || this.isModified('variations')) {
    // Generate base slug from name
    let baseSlug = slugify(this.name, { lower: true, strict: true });

    // Append the first variation if available
    if (this.variations && this.variations.length > 0) {
      baseSlug += `-${slugify(this.variations[0], { lower: true, strict: true })}`;
    }

    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await this.constructor.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // If slug is being changed, store the old slug
    if (this.slug && this.slug !== slug) {
      this.previousSlugs.push(this.slug);
    }

    this.slug = slug;
  }
  next();
});

module.exports = model('Product', productSchema);
