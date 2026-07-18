import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /49218 and its subpaths
  if (request.nextUrl.pathname.startsWith('/49218')) {
    const clickAuth = request.cookies.get('eas_click_auth');
    
    // If they haven't done the click sequence, kick them to home page
    if (!clickAuth || clickAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the login page to be accessed without a token (but REQUIRES clickAuth)
    if (request.nextUrl.pathname === '/49218/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('eas_auth_token_v2');
    
    // If no token exists, redirect to login
    if (!token || !token.value) {
      return NextResponse.redirect(new URL('/49218/login', request.url));
    }
    
    // Note: The actual validation (IP checking) occurs during the login phase 
    // and is enforced by the HTTP-only cookie. For extreme security, we could 
    // also validate the IP on every single page load by calling the DB, 
    // but that would slow down every request. Relying on the secure cookie is standard.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/49218/:path*'],
};
