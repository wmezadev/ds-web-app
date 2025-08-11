import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'

export interface City {
  id: number
  name: string
}

export function useCities(enabled = true) {
  const { fetchApi } = useApi()
  
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCities = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      console.log('[useCities] Fetching cities from /catalogs/cities')
      const response: City[] = await fetchApi('catalogs/cities')
      console.log('[useCities] Response:', response)
      console.log('[useCities] Cities found:', response?.length || 0)
      setCities(response || [])
    } catch (err: any) {
      console.error('[useCities] Error fetching cities:', err)
      setError(err?.message || 'Error al cargar ciudades.')
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchCities()
    }
  }, [enabled, fetchCities])

  return {
    cities,
    loading,
    error,
    refetch: fetchCities
  }
}
