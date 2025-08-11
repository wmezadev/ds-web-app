import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useApi'

export interface Agent {
  id: number
  name: string
}

export function useAgents(enabled = true) {
  const { fetchApi } = useApi()
  
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      console.log('[useAgents] Fetching agents from /catalogs/agents')
      const response: Agent[] = await fetchApi('catalogs/agents')
      console.log('[useAgents] Response:', response)
      setAgents(response || [])
    } catch (err: any) {
      console.error('[useAgents] Error fetching agents:', err)
      setError(err?.message || 'Error al cargar agentes.')
      setAgents([])
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchAgents()
    }
  }, [enabled, fetchAgents])

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents
  }
}
