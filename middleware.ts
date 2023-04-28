import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/utils/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get('token-admin')?.value
  let decode = null
  if (cookie) {
    decode = await verifyToken(cookie)
  }

  const { pathname } = request.nextUrl
  const isRouteLogin = pathname == "/admin/login"

  if (isRouteLogin) {
    if (decode) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    else {
      return NextResponse.next()
    }
  }
  else {
    if (decode) {
      return NextResponse.next()
    }
    else {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}