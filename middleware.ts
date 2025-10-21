import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

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

  // Redirect root to login if not authenticated
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify session using Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access control
  const role = session.user.role
  
  // Check if user is trying to access a role-specific dashboard
  if (pathname.startsWith('/admin/') && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }
  
  if (pathname.startsWith('/manager/') && role !== 'manager') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }
  
  if (pathname.startsWith('/executive/') && role !== 'executive') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }

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