import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'

export interface Office {
  id: number
  name: string
}

export function useOffices(enabled = true) {
  const { fetchApi } = useApi()
  
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffices = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      console.log('[useOffices] Fetching offices from /catalogs/offices')
      const response: Office[] = await fetchApi('catalogs/offices')
      console.log('[useOffices] Response:', response)
      setOffices(response || [])
    } catch (err: any) {
      console.error('[useOffices] Error fetching offices:', err)
      setError(err?.message || 'Error al cargar oficinas.')
      setOffices([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchOffices()
    }
  }, [enabled, fetchOffices])

  return {
    offices,
    loading,
    error,
    refetch: fetchOffices
  }
}
