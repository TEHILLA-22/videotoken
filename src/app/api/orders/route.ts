import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/order.model';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      userAddress,
      tokenMint,
      side,
      orderType,
      amountSol,
      limitPrice,
      executedPrice,
      txSignature,
    } = body;

    if (!userAddress || !tokenMint || !side || !orderType || !amountSol || !txSignature) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const order = await Order.create({
      userAddress,
      tokenMint,
      side,
      orderType,
      amountSol,
      limitPrice,
      executedPrice,
      txSignature,
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Order API error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const tokenMint = url.searchParams.get('tokenMint');

    if (!tokenMint) {
      return NextResponse.json({ error: 'tokenMint query is required' }, { status: 400 });
    }

    const orders = await Order.find({ tokenMint }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error('Order API GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
