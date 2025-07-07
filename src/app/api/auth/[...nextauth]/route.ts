import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { API_BASE_URL } from '@/constants/server/serverRoutes'
import { API_ROUTES, ROUTES } from '@/constants/routes'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'DS API',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch(`${API_BASE_URL}/${API_ROUTES.AUTH.LOGIN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            })
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()

          if (data.message === 'Login successful') {
            return {
              id: data.user.id.toString(),
              name: data.user.full_name,
              email: data.user.email,
              username: data.user.username,
              accessToken: data.access_token,
              refreshToken: data.refresh_token
            }
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)

          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.username = user.username
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ''
        session.user.username = token.username
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      if (new URL(url).origin === baseUrl) {
        return url
      }

      return `${baseUrl}${ROUTES.HOME}`
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
})

export { handler as GET, handler as POST }
