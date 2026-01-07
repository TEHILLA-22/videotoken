import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userAddress: string;
  tokenMint: string;

  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';

  amountSol: number;
  limitPrice?: number;
  executedPrice?: number;

  txSignature: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userAddress: { type: String, required: true, index: true },

    tokenMint: { type: String, required: true, index: true },

    side: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },

    orderType: {
      type: String,
      enum: ['market', 'limit'],
      required: true,
    },

    amountSol: { type: Number, required: true },

    limitPrice: { type: Number },

    executedPrice: { type: Number },

    txSignature: {
      type: String,
      required: true,
      unique: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
