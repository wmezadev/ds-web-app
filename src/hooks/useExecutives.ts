import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

export interface Executive {
  id: number
  name: string
}

export function useExecutives(enabled = true) {
  const { fetchApi } = useApi()
  
  const [executives, setExecutives] = useState<Executive[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExecutives = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response: Executive[] = await fetchApi('catalogs/executives')
      
      setExecutives(response || [])
    } catch (err: any) {
      setError(err?.message || 'Error al cargar ejecutivos.')
      setExecutives([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchExecutives()
    }
  }, [enabled, fetchExecutives])

  return {
    executives,
    loading,
    error,
    refetch: fetchExecutives
  }
}
