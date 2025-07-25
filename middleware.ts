import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page and auth-related routes
  if (pathname === '/admin-login' || 
      pathname === '/auth/confirm' || 
      pathname === '/admin/setup-3fa' ||
      pathname === '/admin/test-auth' ||
      pathname === '/admin/auth-test' ||
      pathname === '/admin/test-totp' ||
      pathname === '/admin/debug-totp') {
    return NextResponse.next()
  }

  // For all other admin routes, let the client-side authentication handle it
  // The ProtectedAdminRoute component will handle the authentication check
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
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