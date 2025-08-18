'use client'

import { useState, useEffect } from 'react'

import { useApi } from './useApi'
import { API_ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'

export function useClient(id: string) {
  const [data, setData] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi } = useApi()

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      
      return
    }

    const fetchClient = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetchApi(API_ROUTES.CLIENTS.GET(id))
        
        setData(response)
      } catch (err: any) {
        setError(err.message || 'Error al cargar el cliente')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [id, fetchApi])

  return { data, isLoading, error }
}
