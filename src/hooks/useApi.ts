import { useSession } from 'next-auth/react'

import { API_PROXY_PATH } from '@/constants/routes'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
}

export const useApi = () => {
  const { data: session, status } = useSession()

  const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
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
    const response = await fetch(`${API_PROXY_PATH}/${endpoint}`, config)

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
