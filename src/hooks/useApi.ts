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

  const fetchApi = async (endpoint: string, options: ApiOptions = {}, retry = true) => {
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

  // Upload file using multipart/form-data with field name "file"
  const uploadFile = async (endpoint: string, file: File) => {
    if (status === 'loading') {
      throw new Error('Session is loading')
    }

    if (status === 'unauthenticated') {
      throw new Error('User not authenticated')
    }

    const formData = new FormData()

    formData.append('file', file)

    let response = await fetch(`${API_PROXY_PATH}/${endpoint}`, {
      method: 'POST',
      body: formData

      // Do not set Content-Type; browser will set it
    })

    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        // Retry original request
        response = await fetch(`${API_PROXY_PATH}/${endpoint}`, {
          method: 'POST',
          body: formData
        })
        if (!response.ok) throw new Error('File upload failed after retry')

        return response.json()
      } else {
        showModal()
        await signOut({ redirect: false })
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) throw new Error('File upload failed')

    return response.json()
  }

  return {
    fetchApi,
    uploadFile,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session
  }
}
