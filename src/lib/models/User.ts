import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    plan: { type: String, default: 'starter' },
    resetPasswordTokenHash: { type: String, default: '' },
    resetPasswordExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: string };

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>('User', userSchema);
