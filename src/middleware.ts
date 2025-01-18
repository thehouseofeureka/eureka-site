// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('authenticated')
  const path = request.nextUrl.pathname

  // Check if current path is in our protected routes
  const isProtectedRoute = [
    '/home',
    '/membership',
    '/membership/roster',
    '/membership/structure',
    '/membership/chapters',
    '/membership/networking',
    '/programs',
    '/programs/investing',
    '/programs/employment',
    '/programs/bartering',
    '/programs/charity',
    '/programs/assistance',
    '/programs/projects',
    '/events',
    '/events/crusades',
    '/events/receptions',
    '/events/outings',
    '/establishments',
    '/establishments/owned',
    '/establishments/affiliated',
    '/account/login',
    '/account/register'
  ].includes(path)

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Static matcher configuration
export const config = {
  matcher: [
    '/home',
    '/membership',
    '/membership/:path*',
    '/programs',
    '/programs/:path*',
    '/events',
    '/events/:path*',
    '/establishments',
    '/establishments/:path*',
    '/account/:path*'
  ]
}