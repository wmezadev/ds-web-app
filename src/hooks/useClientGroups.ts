import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

export interface ClientGroup {
  id: number
  name: string
}

export function useClientGroups(enabled = true) {
  const { fetchApi } = useApi()
  
  const [clientGroups, setClientGroups] = useState<ClientGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientGroups = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response: ClientGroup[] = await fetchApi('catalogs/client_groups')
      
      setClientGroups(response || [])
    } catch (err: any) {

      setError(err?.message || 'Error al cargar grupos de cliente.')
      setClientGroups([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchClientGroups()
    }
  }, [enabled, fetchClientGroups])

  return {
    clientGroups,
    loading,
    error,
    refetch: fetchClientGroups
  }
}
