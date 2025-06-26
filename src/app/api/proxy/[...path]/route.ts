import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

// Constants
import { API_BASE_URL } from '@/constants/routes'

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

    // Get the request body if it exists
    let body: string | undefined

    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text()
    }

    // Get query parameters
    const url = new URL(request.url)
    const queryParams = url.searchParams.toString()

    const fullTargetUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl

    // Forward the request to the DS API
    const response = await fetch(fullTargetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,

        // Forward other headers that might be needed
        ...(request.headers.get('accept') && {
          Accept: request.headers.get('accept')!
        })
      },
      body
    })

    // Get the response data
    const responseData = await response.text()

    // Create a new response with the same status and headers
    const newResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText
    })

    // Copy relevant headers from the original response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        newResponse.headers.set(key, value)
      }
    })

    return newResponse
  } catch (error) {
    console.error('Proxy error:', error)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
