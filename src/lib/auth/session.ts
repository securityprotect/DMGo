import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import type { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'dmgo_token';

export function signAuthToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ sub: userId }, secret, {
    ...signOptions,
  });
}

export async function getAuthedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    if (process.env.DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
      await connectToDatabase();
      const email = process.env.DEV_AUTH_EMAIL || 'dev@dmgo.local';
      let user = await User.findOne({ email }).lean();
      if (!user) {
        const passwordHash = await bcrypt.hash('dev-password-not-for-prod', 10);
        const created = await User.create({ name: 'Dev User', email, passwordHash, plan: 'starter' });
        user = created.toObject();
      }
      return user;
    }
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');

  try {
    const decoded = jwt.verify(token, secret) as { sub: string };
    await connectToDatabase();
    return User.findById(decoded.sub).lean();
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
