import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

export interface ClientBranch {
  id: number
  name: string
}

export function useClientBranches(enabled = true) {
  const { fetchApi } = useApi()
  
  const [clientBranches, setClientBranches] = useState<ClientBranch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientBranches = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {

      const response: ClientBranch[] = await fetchApi('catalogs/client_branches')

      setClientBranches(response || [])
    } catch (err: any) {

      setError(err?.message || 'Error al cargar sucursales de cliente.')
      setClientBranches([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchClientBranches()
    }
  }, [enabled, fetchClientBranches])

  return {
    clientBranches,
    loading,
    error,
    refetch: fetchClientBranches
  }
}
