import { Schema, model, Document, models } from 'mongoose';

interface IPost extends Document {
  title: string;
  title_en?: string;
  category: 'Dairy' | 'Ice Cream' | 'Pastry' | 'Bakery' | 'Packaging' | 'Dried Fruits' | 'Equipment' | 'Other';
  description: string;
  description_en?: string;
  creator: Schema.Types.ObjectId;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    title_en: { type: String },
    category: {
      type: String,
      enum: ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Dried Fruits', 'Equipment', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    description_en: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Post || model<IPost>('Post', postSchema);