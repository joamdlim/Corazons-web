// Lightweight auth config for the proxy/middleware — NO Prisma imports.
// The proxy only needs to verify the JWT, not query the database.
// Full auth config (with Prisma) lives in lib/auth.ts for server-side use.
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  providers: [], // providers not needed for JWT verification in proxy
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Protect /admin/* except /admin/login
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        return isLoggedIn;
      }

      // Protect /api/admin/*
      if (pathname.startsWith('/api/admin')) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
