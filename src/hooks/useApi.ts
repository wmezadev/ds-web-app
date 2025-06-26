import { useSession, signIn, signOut } from 'next-auth/react'

import { useSessionExpired } from '@/context/SessionExpiredContext'

import { API_PROXY_PATH, API_ROUTES } from '@/constants/routes'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
}

export const useApi = () => {
  const { data: session, status } = useSession()
  const { showModal } = useSessionExpired()

  // Helper to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_PROXY_PATH}/${API_ROUTES.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: session?.refreshToken })
      })

      if (!response.ok) throw new Error('Failed to refresh token')
      const data = await response.json()

      // Update session using signIn with credentials provider (no redirect)
      await signIn('credentials', {
        username: session?.user?.username,
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        redirect: false
      })

      return data.access_token
    } catch (err) {
      return null
    }
  }

  const apiCall = async (endpoint: string, options: ApiOptions = {}, retry = true) => {
    if (status === 'loading') {
      throw new Error('Session is loading')
    }

    if (status === 'unauthenticated') {
      throw new Error('User not authenticated')
    }

    const { method = 'GET', body, headers = {} } = options

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    // Use the proxy endpoint
    let response = await fetch(`${API_PROXY_PATH}/${endpoint}`, config)

    if (response.status === 401 && retry) {
      // Try to refresh token
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        // Retry original request
        response = await fetch(`${API_PROXY_PATH}/${endpoint}`, config)
      } else {
        showModal()
        await signOut({ redirect: false })
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  return {
    apiCall,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session
  }
}
