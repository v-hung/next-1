import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/about-2', request.url))
  let cookie = request.cookies.get('token-admin')?.value
  console.log(cookie) // => 'fast'
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}