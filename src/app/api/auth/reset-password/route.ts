import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(req: Request) {
  const body = await req.json();
  const token = String(body?.token || '').trim();
  const newPassword = String(body?.newPassword || '');

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await connectToDatabase();
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  });
  if (!user) return NextResponse.json({ error: 'Reset link is invalid or expired' }, { status: 400 });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordTokenHash = '';
  user.resetPasswordExpiresAt = null;
  await user.save();

  return NextResponse.json({ ok: true });
}

