const { Schema, model } = require('mongoose');

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
  },
  { timestamps: true }
);

module.exports = model('Product', productSchema);
