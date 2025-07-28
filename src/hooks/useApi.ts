import { useCallback } from 'react' // Importar useCallback

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

  // Helper to refresh the access token - ENVUELTO EN useCallback
  const refreshAccessToken = useCallback(async () => {
    try {
      // Necesitamos el refreshToken actual.
      // Si la sesión no está disponible o el refreshToken no está, no podemos refrescar.
      if (!session?.refreshToken) {
        console.warn('No refresh token available. Cannot refresh access token.')

        return null
      }

      const response = await fetch(`${API_PROXY_PATH}/${API_ROUTES.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: session.refreshToken })
      })

      if (!response.ok) {
        // Log the error response if available
        const errorDetail = await response.json().catch(() => ({}))

        console.error('Failed to refresh token:', response.status, errorDetail)
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()

      // Update session using signIn with credentials provider (no redirect)
      // Asegúrate de que signIn con redirect: false actualice la sesión actual de next-auth
      // sin causar un render adicional si no hay un cambio real.
      await signIn('credentials', {
        username: session?.user?.username,
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        redirect: false
      })

      return data.access_token
    } catch (err: any) {
      console.error('Error during token refresh:', err)

      // Podrías considerar un signOut aquí si el refresh token también falla
      // showModal();
      // await signOut({ redirect: false });
      return null
    }
  }, [session, signIn]) // Depende de session para el refreshToken y de signIn (de next-auth)

  // fetchApi - ENVUELTO EN useCallback
  const fetchApi = useCallback(
    async (endpoint: string, options: ApiOptions = {}, retry = true) => {
      // Si la sesión está cargando, es mejor esperar o devolver un error.
      // Lanzar un error aquí puede ser problemático si el `useEffect` en
      // `usePaginatedResource` no lo maneja con `try/catch`.
      if (status === 'loading') {
        // O podrías devolver una Promesa que se resuelva cuando la sesión esté lista,
        // pero por ahora, lanzar un error es consistente con tu implementación.
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
          ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
          ...headers
        }
      }

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body)
      }

      let response = await fetch(`${API_PROXY_PATH}/${endpoint}`, config)

      if (response.status === 401 && retry) {
        const newAccessToken = await refreshAccessToken()

        if (newAccessToken) {
          // Reconstruye el header de autorización con el nuevo token
          config.headers = {
            ...config.headers, // Mantén otros headers
            Authorization: `Bearer ${newAccessToken}`
          }

          // Reintentar la solicitud original con el nuevo token
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
    },
    [session, status, refreshAccessToken, showModal, signOut]
  ) // Dependencias de fetchApi

  // uploadFile - ENVUELTO EN useCallback
  const uploadFile = useCallback(
    async (endpoint: string, file: File) => {
      if (status === 'loading') {
        throw new Error('Session is loading')
      }

      if (status === 'unauthenticated') {
        throw new Error('User not authenticated')
      }

      const formData = new FormData()

      formData.append('file', file)

      const initialConfig: RequestInit = {
        method: 'POST',
        body: formData,
        headers: {
          ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {})
        }
      }

      let response = await fetch(`${API_PROXY_PATH}/${endpoint}`, initialConfig)

      if (response.status === 401) {
        // No necesita `retry` como `fetchApi` porque no tiene un flag `retry`
        const newAccessToken = await refreshAccessToken()

        if (newAccessToken) {
          // Reconstruye el header de autorización con el nuevo token
          const retryConfig: RequestInit = {
            method: 'POST',
            body: formData, // FormData no se serializa, puede necesitar ser recreado o manejado cuidadosamente si ya fue consumido
            headers: {
              Authorization: `Bearer ${newAccessToken}`
            }
          }

          // Reintentar la solicitud original con el nuevo token
          response = await fetch(`${API_PROXY_PATH}/${endpoint}`, retryConfig)
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
    },
    [session, status, refreshAccessToken, showModal, signOut]
  ) // Dependencias de uploadFile

  return {
    fetchApi,
    uploadFile,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session
  }
}
