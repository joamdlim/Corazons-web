import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16 requires an explicit function — not a destructured const — for the proxy export.
// `export default auth` satisfies the check: it's a default function export.
// The authorized() callback in authConfig handles all route protection logic.
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
