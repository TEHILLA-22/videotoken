import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri =
  'mongodb+srv://joblawal33:joblawal33@createtoken.loau9mg.mongodb.net/?retryWrites=true&w=majority&appName=createtoken';
const dbName = 'videotoken';

async function connectToDB() {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  return { client, db };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mint,
      name,
      symbol,
      amount,
      decimals,
      videoUri,
      imageUri,
      description,
      telegram,
      instagram,
      website,
      other_socials,
      createdAt,
    } = body;

    if (!mint || !amount || !name || !symbol || !videoUri || !imageUri) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { client, db } = await connectToDB();
    const collection = db.collection('tokens');

    await collection.insertOne({
      mint,
      name,
      symbol,
      amount,
      decimals,
      videoUri,
      imageUri,
      description,
      telegram: telegram || null,
      instagram: instagram || null,
      website: website || null,
      other_socials: other_socials || null,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    await client.close();
    return NextResponse.json({ success: true, message: 'Token saved successfully.' });
  } catch (err: any) {
    console.error('MongoDB Insert Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const mint = searchParams.get('mint');

    const { client, db } = await connectToDB();
    const collection = db.collection('tokens');

    const query: any = {};
    if (name) query.name = { $regex: new RegExp(name, 'i') };
    if (mint) query.mint = mint;

    const tokens = await collection.find(query).sort({ createdAt: -1 }).toArray();

    await client.close();
    return NextResponse.json({ success: true, tokens });
  } catch (err: any) {
    console.error('MongoDB Fetch Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/*
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Token } from '@/models/token.model';

export async function POST(req: Request) {
  try {
    await connectDB('videotoken');
    const body = await req.json();

    const {
      mint,
      name,
      symbol,
      amount,
      decimals,
      videoUri,
      imageUri,
      description,
      telegram,
      instagram,
      website,
      other_socials,
      createdAt,
    } = body;

    if (!mint || !name || !symbol || !amount || !videoUri || !imageUri) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token = await Token.create({
      mint,
      name,
      symbol,
      amount,
      decimals: decimals ?? 9,
      videoUri,
      imageUri,
      description,
      telegram,
      instagram,
      website,
      other_socials,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (err: any) {
    console.error('Save Token Error:', err);

    if (err.code === 11000) {
      return NextResponse.json({ error: 'Token already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: err.message || 'Failed to save token' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const mint = searchParams.get('mint');

    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (mint) {
      query.mint = mint;
    }

    const tokens = await Token.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, tokens });
  } catch (err: any) {
    console.error('Fetch Token Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch tokens' }, { status: 500 });
  }
}

*/
