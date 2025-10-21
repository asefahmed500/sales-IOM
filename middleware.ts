import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and auth routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next()
  }

  // Allow access to homepage
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Check for session token in cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For specific dashboard routes, check role-based access
  // We'll allow the request to proceed and handle role checking in the page components
  // This avoids the Edge Runtime limitations with database access
  
  return NextResponse.next()
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
}