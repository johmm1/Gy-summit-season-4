import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const isAdmin = ['SUPER_ADMIN', 'PRESBYTERY_ADMIN'].includes(req.nextauth?.token?.role);
    
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/reports/:path*'],
};
