import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { planId, amount } = body;

  const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  const merchantId = process.env.PHONEPE_MERCHANT_ID;
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const redirectUrl = process.env.PHONEPE_REDIRECT_URL;

  if (!merchantId || !saltKey || !redirectUrl) {
    return NextResponse.json({ error: 'PhonePe config missing in env' }, { status: 500 });
  }

  const merchantTransactionId = `dmgo_${Date.now()}`;
  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId: 'dmgo-user',
    amount: Math.round(Number(amount) * 100),
    redirectUrl,
    redirectMode: 'REDIRECT',
    callbackUrl: redirectUrl,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
    metaInfo: { udf1: planId },
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const path = '/pg/v1/pay';
  const checksum = crypto.createHash('sha256').update(payloadBase64 + path + saltKey).digest('hex');
  const xVerify = `${checksum}###${saltIndex}`;

  const response = await fetch(`${hostUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      accept: 'application/json',
    },
    body: JSON.stringify({ request: payloadBase64 }),
  });

  const data = await response.json();
  const payUrl = data?.data?.instrumentResponse?.redirectInfo?.url;

  if (!response.ok || !payUrl) {
    return NextResponse.json({ error: 'Unable to create PhonePe payment', raw: data }, { status: 400 });
  }

  return NextResponse.json({ checkoutUrl: payUrl, merchantTransactionId });
}
