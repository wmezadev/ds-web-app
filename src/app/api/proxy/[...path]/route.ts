import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

// Constants
import { API_BASE_URL } from '@/constants/server/serverRoutes'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy/', '').split('/')

  return handleRequest(request, path, 'GET')
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy/', '').split('/')

  return handleRequest(request, path, 'POST')
}

export async function PUT(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy/', '').split('/')

  return handleRequest(request, path, 'PUT')
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy/', '').split('/')

  return handleRequest(request, path, 'DELETE')
}

export async function PATCH(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy/', '').split('/')

  return handleRequest(request, path, 'PATCH')
}

async function handleRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    // Get the token from the session
    const token = await getToken({ req: request })

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 })
    }

    // Construct the target URL
    const path = pathSegments.join('/')
    const targetUrl = `${API_BASE_URL}/${path}`

    // Prepare body for proxying: stream for non-GET/DELETE, undefined otherwise
    let body: any = undefined

    if (method !== 'GET' && method !== 'DELETE') {
      body = request.body
    }

    // Get query parameters
    const url = new URL(request.url)
    const queryParams = url.searchParams.toString()

    const fullTargetUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl

    // Prepare headers: forward all except host, set Authorization
    const headers = new Headers(request.headers)

    headers.set('Authorization', `Bearer ${token.accessToken}`)
    headers.delete('host')

    // Required for Node.js/Edge when streaming a body
    const fetchOptions: RequestInit = {
      method,
      headers,
      body
    }

    if (body) {
      // @ts-ignore
      fetchOptions.duplex = 'half'
    }

    const response = await fetch(fullTargetUrl, fetchOptions)

    // Get the response data
    const responseData = await response.text()

    // Create a new response with the same status and headers
    const newResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText
    })

    // Disable caching for all proxied API responses
    newResponse.headers.set('Cache-Control', 'no-store, max-age=0')

    // Copy relevant headers from the original response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'cache-control') {
        newResponse.headers.set(key, value)
      }
    })

    return newResponse
  } catch (error) {
    console.error('Proxy error:', error)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
