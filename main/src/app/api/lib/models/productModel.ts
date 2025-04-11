import { Schema, model, Document, models } from 'mongoose';
import slugify from 'slugify';

interface IProduct extends Document {
  name: string;
  name_en?: string;
  category: string;
  description: string;
  description_en?: string;
  creator: Schema.Types.ObjectId;
  images: string[];
  variations: string[];
  variations_en?: string[];
  slug: string;
  previousSlugs: string[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    name_en: { type: String },
    category: {
      type: String,
      enum: ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Dried Fruits', 'Equipment', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    description_en: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String, required: true }],
    variations: [{ type: String }],
    variations_en: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    previousSlugs: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.pre('validate', async function (next) {
  if (this.isModified('name') || this.isModified('variations')) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    if (this.variations && this.variations.length > 0) {
      baseSlug += `-${slugify(this.variations[0], { lower: true, strict: true })}`;
    }
    let slug = baseSlug;
    let counter = 1;
    while (await (this.constructor as any).exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    if (this.slug && this.slug !== slug) {
      this.previousSlugs.push(this.slug);
    }
    this.slug = slug;
  }
  next();
});

const Product = models.Product || model<IProduct>('Product', productSchema);
export default Product;