import { useEffect, useState } from 'react'

import type { Client } from '@/types/client'

export function useClientSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setResults([])

      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const signal = controller.signal

    fetch(`/api/proxy/clients/search?query=${encodeURIComponent(query)}`, { signal })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Error en la búsqueda: ${res.statusText}`)
        }

        const data = await res.json()

        setResults(data.clients || [])
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al buscar clientes')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [query, enabled])

  return { results, loading, error }
}
