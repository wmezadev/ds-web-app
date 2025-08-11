import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'

export interface ClientCategory {
  id: number
  name: string
}

export function useClientCategories(enabled = true) {
  const { fetchApi } = useApi()
  
  const [clientCategories, setClientCategories] = useState<ClientCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientCategories = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      console.log('[useClientCategories] Fetching client categories from /catalogs/client_categories')
      const response: ClientCategory[] = await fetchApi('catalogs/client_categories')
      console.log('[useClientCategories] Response:', response)
      setClientCategories(response || [])
    } catch (err: any) {
      console.error('[useClientCategories] Error fetching client categories:', err)
      setError(err?.message || 'Error al cargar categorías de cliente.')
      setClientCategories([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchClientCategories()
    }
  }, [enabled, fetchClientCategories])

  return {
    clientCategories,
    loading,
    error,
    refetch: fetchClientCategories
  }
}
