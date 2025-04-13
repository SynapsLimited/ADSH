import { Schema, model, Document, models } from 'mongoose';

interface IUser extends Document {
  _id: string; // Explicitly define _id
  name: string;
  email: string;
  password: string;
  avatar?: string;
  avatarPublicId?: string;
  posts: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  avatarPublicId: { type: String },
  posts: { type: Number, default: 0 },
});

const User = models.User || model<IUser>('User', userSchema);
export default User;