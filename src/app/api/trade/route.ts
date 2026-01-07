import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pumpRes = await fetch('https://api.pumpapi.io', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!pumpRes.ok) {
      const text = await pumpRes.text();
      return NextResponse.json({ error: text }, { status: pumpRes.status });
    }

    const arrayBuffer = await pumpRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (err: any) {
    console.error('Pump proxy error:', err);
    return NextResponse.json({ error: err.message || 'Proxy failed' }, { status: 500 });
  }
}
