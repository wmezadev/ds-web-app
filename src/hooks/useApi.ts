'use client'

import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

import { ROUTES } from '@/constants/routes'

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, any> | any[]
}

export const useApi = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const fetchApi = useCallback(
    async (endpoint: string, options: ApiOptions = {}) => {
      const { body, ...restOptions } = options
      const isExternalUrl = endpoint.startsWith('http')
      const apiUrl = isExternalUrl ? endpoint : `/api/proxy/${endpoint}`

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

      if (body) {
        requestOptions.body = JSON.stringify(body)

      }

      try {
        const response = await fetch(apiUrl, requestOptions)

        if (!response.ok) {
          let errorData: any = 'An unknown error occurred.'

          try {
            const responseText = await response.text()

            try {
              errorData = JSON.parse(responseText)
            } catch (e) {
              errorData = responseText
            }
          } catch (e) {
            errorData = 'Failed to read error response'
          }

          const errorMessage = errorData?.detail || errorData?.message || (typeof errorData === 'object' ? JSON.stringify(errorData, null, 2) : errorData)
          
          // Debug: Log detailed error response for debugging
          console.log('DEBUG: Full API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            errorData: errorData,
            url: apiUrl,
            method: requestOptions.method
          })

          if (response.status === 401) {
            await signOut({ redirect: false })
            router.push(ROUTES.LOGIN)
            throw new Error('Authentication failed. Please sign in again.')
          }

          throw new Error(`HTTP error! status: ${response.status}, error: ${errorMessage}`)
        }

        if (response.status === 204) {
          return null
        }

        return await response.json()
      } catch (error: any) {

        throw error
      }
    },
    [session, router]
  )

  return { fetchApi }
}
