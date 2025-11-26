
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

// NOTE: We are not using firebase-admin here anymore to avoid runtime issues.
// Token verification will be handled by API routes or server components
// that need to protect data. This middleware will just handle routing.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  
  const isAuthenticated = !!cookie?.value;

  // If user is on the login page but is authenticated, redirect to dashboard
  if (pathname.startsWith('/login')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && !pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is at the root, redirect to dashboard (assuming they are authenticated at this point)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
