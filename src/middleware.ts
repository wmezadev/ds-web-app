import { NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Debug: log token and pathname
    // @ts-ignore
    console.log('MIDDLEWARE:', {
      pathname: req.nextUrl.pathname,
      token: req.nextauth?.token
    })

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Debug: log token in callback
        // @ts-ignore
        console.log('AUTHORIZED CALLBACK:', { token })

        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/((?!api/auth|login|_next/static|_next/image|images|favicon.ico).*)']
}
