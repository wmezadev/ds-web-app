'use client'

import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

import { ROUTES } from '@/constants/routes'

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | unknown[] | FormData
}

export const useApi = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const fetchApi = useCallback(
    async <T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
      const { body, ...restOptions } = options
      const isExternalUrl = endpoint.startsWith('http')
      const normalizedEndpoint = isExternalUrl ? endpoint : endpoint.replace(/^\/+/, '')
      const apiUrl = isExternalUrl ? endpoint : `/api/proxy/${normalizedEndpoint}`

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(restOptions.headers as Record<string, string>)
      }

      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }

      const requestOptions: RequestInit = {
        method: options.method || 'GET',
        headers,
        ...restOptions
      }

      if (body) requestOptions.body = JSON.stringify(body)

      try {
        const response = await fetch(apiUrl, requestOptions)

        if (!response.ok) {
          let errorData: string | Record<string, unknown> = 'An unknown error occurred.'

          try {
            const responseText = await response.text()

            try {
              errorData = JSON.parse(responseText) as Record<string, unknown>
            } catch {
              errorData = responseText
            }
          } catch {
            errorData = 'Failed to read error response'
          }

          const errorMessage =
            typeof errorData === 'object' && errorData !== null
              ? (errorData.detail as string) || (errorData.message as string) || JSON.stringify(errorData)
              : String(errorData)

          if (response.status === 401) {
            await signOut({ redirect: false })
            router.push(ROUTES.LOGIN)
            throw new Error('Authentication failed. Please sign in again.')
          }

          throw new Error(`HTTP error! status: ${response.status}, error: ${errorMessage}`)
        }

        if (response.status === 204 || response.status === 205) {
          return undefined as T
        }

        const contentType = response.headers.get('content-type') || ''

        if (!contentType.toLowerCase().includes('application/json')) {
          const text = await response.text()

          if (!text) return undefined as T

          return text as unknown as T
        }

        const text = await response.text()

        if (!text) return undefined as T

        return JSON.parse(text) as T
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error
        }

        throw new Error(`Unknown error occurred: ${String(error)}`)
      }
    },
    [session, router]
  )

  const uploadFile = useCallback(
    async <T = any>(
      endpoint: string,
      file: File,
      options?: {
        fileFieldName?: string
        method?: 'POST' | 'PUT' | 'PATCH'
        extraFields?: Record<string, string | number | boolean | Blob | null | undefined>
      }
    ): Promise<T> => {
      const isExternalUrl = endpoint.startsWith('http')
      const normalizedEndpoint = isExternalUrl ? endpoint : endpoint.replace(/^\/+/, '')
      const apiUrl = isExternalUrl ? endpoint : `/api/proxy/${normalizedEndpoint}`

      const formData = new FormData()
      formData.append(options?.fileFieldName || 'file', file)

      if (options?.extraFields) {
        Object.entries(options.extraFields).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          if (value instanceof Blob) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        })
      }

      const headers: Record<string, string> = {
        Accept: 'application/json'
      }

      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }

      const response = await fetch(apiUrl, {
        method: options?.method || 'POST',
        body: formData,
        headers
      })

      if (!response.ok) {
        let errorData: string | Record<string, unknown> = 'An unknown error occurred.'

        try {
          const responseText = await response.text()
          try {
            errorData = JSON.parse(responseText) as Record<string, unknown>
          } catch {
            errorData = responseText
          }
        } catch {
          errorData = 'Failed to read error response'
        }

        const errorMessage =
          typeof errorData === 'object' && errorData !== null
            ? (errorData as any).detail || (errorData as any).message || JSON.stringify(errorData)
            : String(errorData)

        if (response.status === 401) {
          await signOut({ redirect: false })
          router.push(ROUTES.LOGIN)
          throw new Error('Authentication failed. Please sign in again.')
        }

        throw new Error(`HTTP error! status: ${response.status}, error: ${errorMessage}`)
      }

      if (response.status === 204 || response.status === 205) {
        return undefined as T
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.toLowerCase().includes('application/json')) {
        const text = await response.text()
        if (!text) return undefined as T
        return text as unknown as T
      }

      const text = await response.text()
      if (!text) return undefined as T
      return JSON.parse(text) as T
    },
    [session, router]
  )

  const uploadFiles = useCallback(
    async <T = any>(
      endpoint: string,
      files: File[],
      options?: {
        fileFieldName?: string
        method?: 'POST' | 'PUT' | 'PATCH'
        extraFields?: Record<string, string | number | boolean | Blob | null | undefined>
      }
    ): Promise<T> => {
      // ... (el código es idéntico a uploadFile, solo con un bucle para los archivos)
      const isExternalUrl = endpoint.startsWith('http')
      const normalizedEndpoint = isExternalUrl ? endpoint : endpoint.replace(/^\/+/, '')
      const apiUrl = isExternalUrl ? endpoint : `/api/proxy/${normalizedEndpoint}`

      const formData = new FormData()
      const field = options?.fileFieldName || 'files'
      files.forEach(f => formData.append(field, f))

      if (options?.extraFields) {
        Object.entries(options.extraFields).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          if (value instanceof Blob) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        })
      }

      const headers: Record<string, string> = {
        Accept: 'application/json'
      }

      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }

      const response = await fetch(apiUrl, {
        method: options?.method || 'POST',
        body: formData,
        headers
      })

      if (!response.ok) {
        let errorData: string | Record<string, unknown> = 'An unknown error occurred.'

        try {
          const responseText = await response.text()
          try {
            errorData = JSON.parse(responseText) as Record<string, unknown>
          } catch {
            errorData = responseText
          }
        } catch {
          errorData = 'Failed to read error response'
        }

        const errorMessage =
          typeof errorData === 'object' && errorData !== null
            ? (errorData as any).detail || (errorData as any).message || JSON.stringify(errorData)
            : String(errorData)

        if (response.status === 401) {
          await signOut({ redirect: false })
          router.push(ROUTES.LOGIN)
          throw new Error('Authentication failed. Please sign in again.')
        }

        throw new Error(`HTTP error! status: ${response.status}, error: ${errorMessage}`)
      }

      if (response.status === 204 || response.status === 205) {
        return undefined as T
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.toLowerCase().includes('application/json')) {
        const text = await response.text()
        if (!text) return undefined as T
        return text as unknown as T
      }

      const text = await response.text()
      if (!text) return undefined as T
      return JSON.parse(text) as T
    },
    [session, router]
  )

  return { fetchApi, uploadFile, uploadFiles }
}
