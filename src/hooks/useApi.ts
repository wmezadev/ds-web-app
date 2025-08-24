'use client'

import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

import { ROUTES } from '@/constants/routes'

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | unknown[] | FormData
}

export const useApi = () => {
  const { data: session } = useSession()
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

        return await response.json()
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error
        }

        throw new Error(`Unknown error occurred: ${String(error)}`)
      }
    },
    [session, router]
  )

  return { fetchApi }
}
