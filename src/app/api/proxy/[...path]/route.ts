import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

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
    const token = await getToken({ req: request })

    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 })
    }

    const path = pathSegments.join('/')
    const targetUrl = `${API_BASE_URL}/${path}`

    let body: string | undefined = undefined

    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text()
    }

    const url = new URL(request.url)
    const queryParams = url.searchParams.toString()

    const fullTargetUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl

    const headers = new Headers(request.headers)

    headers.set('Authorization', `Bearer ${token.accessToken}`)
    headers.delete('host')

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      headers.set('Content-Type', 'application/json')
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: body || undefined
    }

    const response = await fetch(fullTargetUrl, fetchOptions)

    if (response.status === 204 || response.status === 205) {
      const noContentResponse = new NextResponse(null, {
        status: response.status,
        statusText: response.statusText
      })

      noContentResponse.headers.set('Cache-Control', 'no-store, max-age=0')

      return noContentResponse
    }

    const responseData = await response.text()

    const newResponse = new NextResponse(responseData || null, {
      status: response.status,
      statusText: response.statusText
    })

    newResponse.headers.set('Cache-Control', 'no-store, max-age=0')

    const skipHeaders = new Set([
      'content-encoding',
      'cache-control',
      'content-length',
      'transfer-encoding',
      'connection',
      'keep-alive',
      'proxy-authenticate',
      'proxy-authorization',
      'te',
      'trailer',
      'upgrade'
    ])

    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase()

      if (!skipHeaders.has(lower)) {
        try {
          newResponse.headers.set(key, value)
        } catch {}
      }
    })

    return newResponse
  } catch (error) {
    console.error('Proxy error:', error)

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
