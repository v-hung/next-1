import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/utils/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get('token-admin')?.value
  let adminId = null
  if (cookie) {
    let temp = await verifyToken(cookie)
    if (temp.payload.sub) {
      adminId = temp.payload.sub
    }
  }

  const { pathname } = request.nextUrl
  const isRouteLogin = pathname == "/admin/login"

  if (isRouteLogin) {
    if (adminId) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('adminId', adminId)

      return NextResponse.redirect(new URL('/admin', request.url), {
        headers: requestHeaders
      })
    }
    else {
      return NextResponse.next()
    }
  }
  else {
    if (adminId) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('adminId', adminId)

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
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