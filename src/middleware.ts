import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROUTES = ['/admin/dashboard', '/admin/posts'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('blog_admin_token')?.value;

  const isProtected = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isApiProtected =
    pathname.startsWith('/api/posts') || pathname.startsWith('/api/upload');

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
