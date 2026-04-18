import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Use the lightweight, Prisma-free auth config for the proxy.
// This avoids loading Node.js-only modules (like Prisma) in Vercel's edge runtime.
// The authorized() callback in authConfig handles all route protection logic.
export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
