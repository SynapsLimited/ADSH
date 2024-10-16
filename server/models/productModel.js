// models/productModel.js

const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Other'],
      required: true,
      message: '{VALUE} is not supported',
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String, required: true }], // Array of image URLs
    variations: [{ type: String }], // Optional array of variations
  },
  { timestamps: true }
);

module.exports = model('Product', productSchema);
