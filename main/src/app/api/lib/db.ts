import mongoose, { Schema, model, models } from 'mongoose';
import slugify from 'slugify';

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState >= 1) {
  } else {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('Database connection failed');
    }
  }

  // Register User model if not already registered
  if (!models.User) {
    const userSchema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      avatar: { type: String },
      avatarPublicId: { type: String },
      posts: { type: Number, default: 0 },
    });
    model('User', userSchema);
  }

  // Register Product model if not already registered
  if (!models.Product) {
    const productSchema = new Schema({
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
    }, { timestamps: true });

    // Pre-validate hook for slug generation
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

    model('Product', productSchema);
  }
};

export default connectDB;