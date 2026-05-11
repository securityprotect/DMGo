import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/services/email';

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body?.email || '').trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ ok: true, message: 'If this email exists, a reset link has been sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  const webUrl = (process.env.WEB_URL || 'http://localhost:4028').trim();
  const resetUrl = `${webUrl}/sign-up-login-screen?mode=reset&token=${encodeURIComponent(token)}`;
  let emailResult: { sent: boolean; reason?: string } = { sent: false, reason: 'unknown' };
  try {
    emailResult = await sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'email send failed';
    emailResult = { sent: false, reason: message };
  }

  if (!emailResult.sent) {
    return NextResponse.json(
      {
        error: 'Could not send reset email. Please check email SMTP configuration and try again.',
        details: process.env.NODE_ENV !== 'production' ? emailResult.reason : undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: 'If this email exists, a reset link has been sent.' });
}
