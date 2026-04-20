import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected =
    pathname.startsWith('/blog-dashboard') ||
    pathname.startsWith('/admin-panel') ||
    pathname.startsWith('/nerdsadmin');
  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (accessToken || refreshToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/blog-dashboard',
    '/blog-dashboard/:path*',
    '/admin-panel',
    '/admin-panel/:path*',
    '/nerdsadmin',
    '/nerdsadmin/:path*',
  ],
};
