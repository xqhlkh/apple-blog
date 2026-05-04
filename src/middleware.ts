import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const ADMIN_ROUTES = ['/admin/dashboard', '/admin/posts'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('blog_admin_token')?.value;

  // Check if the path is a protected admin route
  const isProtected = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isApiProtected =
    pathname.startsWith('/api/posts') || pathname.startsWith('/api/upload');

  // If accessing protected routes without auth, redirect to login
  if ((isProtected || isApiProtected) && !token) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/upload/:path*'],
};
