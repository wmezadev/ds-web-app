import { NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    // Protect all routes except auth-related ones
    '/((?!api/auth|login|_next/static|_next/image|images|favicon.ico).*)'
  ]
}
