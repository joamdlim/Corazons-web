import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// NextAuth v5: wrap proxy with auth() so request.auth is populated
// The old getToken() approach fails on HTTPS because the v5 cookie name changed
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.auth;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
