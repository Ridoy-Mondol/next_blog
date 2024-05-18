import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export function middleware(request) {
const token = request.cookies.get('token2')?.value;
const notAccess = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup';
if (notAccess && token) {
    return NextResponse.redirect(new URL('/', request.url));
}
if (!notAccess && !token) {
    return NextResponse.redirect(new URL('/signup', request.url));
}
}

export const config = {
  matcher: ['/', '/login', '/signup', '/profile/:path*', '/post/:path*', '/articles/:path*'],
}