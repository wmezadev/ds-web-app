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

    // Read the request body as text to avoid stream-related errors.
    let body: string | undefined = undefined

    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text()
    }

    // Get query parameters
    const url = new URL(request.url)
    const queryParams = url.searchParams.toString()

    const fullTargetUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl

    // Prepare headers: forward all except host, set Authorization
    const headers = new Headers(request.headers)

    headers.set('Authorization', `Bearer ${token.accessToken}`)
    headers.delete('host')

    // NOTE: Set the 'Content-Type' header explicitly for POST requests.
    // This is a good practice and can prevent some backend parsing errors.
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      headers.set('Content-Type', 'application/json')
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: body || undefined // Only include body if it exists
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
