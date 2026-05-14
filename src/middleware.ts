import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'dmgo_token';
const PROFILE_COOKIE = 'dmgo_profile';
const LOGIN_PATH = '/sign-up-login-screen';

function encodeProfileCookie(profile: { name?: string; email?: string; plan?: string }) {
  const text = JSON.stringify({
    name: profile.name || '',
    email: profile.email || '',
    plan: profile.plan || 'starter',
  });
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeJwtPayload(token: string): { name?: string; email?: string; plan?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { name?: string; email?: string; plan?: string };
    return payload;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();

  if (pathname.startsWith('/dashboard') && token) {
    const payload = decodeJwtPayload(token);
    if (payload?.email) {
      res.cookies.set({
        name: PROFILE_COOKIE,
        value: encodeProfileCookie(payload),
        httpOnly: false,
        secure: req.nextUrl.protocol === 'https:',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
