import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { planId, amount } = body;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const currency = process.env.RAZORPAY_CURRENCY || 'INR';

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay config missing in env' }, { status: 500 });
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const amountInSmallestUnit = Math.round(parsedAmount * 100);
  const receipt = `dmgo_${Date.now()}`;
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInSmallestUnit,
      currency,
      receipt,
      notes: { planId },
    }),
  });

  const data = await response.json();
  if (!response.ok || !data?.id) {
    return NextResponse.json({ error: 'Unable to create Razorpay order', raw: data }, { status: 400 });
  }

  return NextResponse.json({
    orderId: data.id,
    keyId,
    amount: data.amount,
    currency: data.currency,
    name: 'DMGo',
    description: `Subscription payment for ${planId}`,
  });
}
