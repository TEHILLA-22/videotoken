import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IToken extends Document {
  mint: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  videoUri: string;
  imageUri: string;
  description?: string;
  telegram?: string;
  instagram?: string;
  website?: string;
  other_socials?: string;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    mint: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true },
    symbol: { type: String, required: true },

    amount: { type: Number, required: true },
    decimals: { type: Number, default: 9 },

    videoUri: { type: String, required: true },
    imageUri: { type: String, required: true },

    description: { type: String },

    telegram: { type: String },
    instagram: { type: String },
    website: { type: String },
    other_socials: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export const Token: Model<IToken> =
  mongoose.models.Token || mongoose.model<IToken>('Token', TokenSchema);
