import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { setAuthCookie, signAuthToken } from '@/lib/auth/session';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signAuthToken(String(user._id));
  const res = NextResponse.json({ user: { id: String(user._id), name: user.name, email: user.email } });
  res.cookies.set(setAuthCookie(token));
  return res;
}
