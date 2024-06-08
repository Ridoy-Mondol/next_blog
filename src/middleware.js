import { NextResponse } from 'next/server'
 
export function middleware(request) {
const token = request.cookies.get('token2')?.value;
const verifyToken = request.cookies.get('token')?.value;
const notAccess = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/signup/verify';
const notVerify = request.nextUrl.pathname === '/signup/verify';
if (notAccess && token) {
    return NextResponse.redirect(new URL('/', request.url));
}
if (!notAccess && !token) {
    return NextResponse.redirect(new URL('/signup', request.url));
}
if (notVerify && !verifyToken && token) {
  return NextResponse.redirect(new URL('/', request.url));
}
if (notVerify && !verifyToken && !token) {
  return NextResponse.redirect(new URL('/signup', request.url));
}
}

export const config = {
  matcher: ['/', '/login', '/signup/:path*', '/profile/:path*', '/post/:path*', '/articles/:path*'],
}
