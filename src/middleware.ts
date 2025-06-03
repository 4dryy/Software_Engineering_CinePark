import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'cinematch_session';
const AUTHENTICATED_PATHS = [
  '/dashboard',
  '/profile',
  '/quiz',
  '/recommendations',
  '/local-cinemas',
  '/about', // Added about page
];
const PUBLIC_PATHS = ['/landing', '/login', '/signup']; // Paths accessible without login

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const isAccessingAuthenticatedPath = AUTHENTICATED_PATHS.some(path => pathname.startsWith(path));
  const isAccessingPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  if (isAccessingAuthenticatedPath) {
    if (!sessionCookie) {
      // User is not authenticated and trying to access a protected route, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
    // User is authenticated and accessing a protected route, allow
    return NextResponse.next();
  }

  if (isAccessingPublicPath) {
    if (sessionCookie && (pathname === '/login' || pathname === '/signup' || pathname === '/landing')) {
      // User is authenticated and trying to access login/signup/landing, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // User is accessing a public route (or not authenticated), allow
    return NextResponse.next();
  }
  
  // For any other paths not explicitly handled (e.g. api routes, _next internal routes), allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for static files and specific Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
